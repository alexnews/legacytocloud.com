"""Article search: vector similarity (preferred) or keyword fallback."""

from __future__ import annotations

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


async def find_similar_articles(
    query_embedding: list[float],
    db: AsyncSession,
    top_k: int = 5,
) -> list[dict]:
    """Find articles most similar to the query embedding.

    Returns list of dicts with id, title, slug, content, source, similarity.
    """
    vec_str = "[" + ",".join(str(x) for x in query_embedding) + "]"

    result = await db.execute(
        text("""
            SELECT
                a.id, a.title, a.slug, a.content, a.source, a.summary,
                1 - (e.embedding <=> CAST(:vec AS vector)) AS similarity
            FROM pipeline.articles a
            JOIN pipeline.article_embeddings e ON a.id = e.article_id
            WHERE a.status = 'published'
            ORDER BY e.embedding <=> CAST(:vec AS vector)
            LIMIT :k
        """),
        {"vec": vec_str, "k": top_k},
    )
    rows = result.mappings().all()
    return [dict(r) for r in rows]


async def keyword_search_articles(
    query: str,
    db: AsyncSession,
    top_k: int = 5,
) -> list[dict]:
    """Fallback: full-text keyword search when embedder is unavailable."""
    # Build a tsquery from the user's words
    words = [w.strip() for w in query.split() if len(w.strip()) >= 2]
    if not words:
        return []
    ts_query = " | ".join(words)

    result = await db.execute(
        text("""
            SELECT
                a.id, a.title, a.slug, a.content, a.source, a.summary,
                ts_rank(
                    to_tsvector('english', coalesce(a.title,'') || ' ' || coalesce(a.content,'')),
                    to_tsquery('english', :q)
                ) AS similarity
            FROM pipeline.articles a
            WHERE a.status = 'published'
              AND to_tsvector('english', coalesce(a.title,'') || ' ' || coalesce(a.content,''))
                  @@ to_tsquery('english', :q)
            ORDER BY similarity DESC
            LIMIT :k
        """),
        {"q": ts_query, "k": top_k},
    )
    rows = result.mappings().all()
    return [dict(r) for r in rows]
