"""Vector similarity search over article embeddings."""

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
                1 - (e.embedding <=> :vec::vector) AS similarity
            FROM pipeline.articles a
            JOIN pipeline.article_embeddings e ON a.id = e.article_id
            WHERE a.status = 'published'
            ORDER BY e.embedding <=> :vec::vector
            LIMIT :k
        """),
        {"vec": vec_str, "k": top_k},
    )
    rows = result.mappings().all()
    return [dict(r) for r in rows]
