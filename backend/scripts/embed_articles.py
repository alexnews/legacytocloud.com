"""Embed news articles into pgvector for RAG search.

Usage (from backend directory):
    venv/bin/python -m scripts.embed_articles
    venv/bin/python -m scripts.embed_articles --reembed
    venv/bin/python -m scripts.embed_articles --dry-run

Designed to be called from cron after pull_news.py.
"""

import argparse
import asyncio
import logging
import os
import sys
from pathlib import Path

# Ensure backend is on the path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

# Load .env from project root
from dotenv import load_dotenv
load_dotenv(backend_dir.parent / ".env")

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)


async def main(dry_run: bool = False, reembed: bool = False) -> int:
    from sqlalchemy import text
    from app.core.database import async_session
    from app.rag.embedder import embed_batch

    async with async_session() as db:
        # Find articles that need embedding
        if reembed:
            result = await db.execute(
                text("""
                    SELECT id, title, content, summary
                    FROM pipeline.articles
                    WHERE status = 'published'
                    ORDER BY id
                """)
            )
        else:
            result = await db.execute(
                text("""
                    SELECT a.id, a.title, a.content, a.summary
                    FROM pipeline.articles a
                    LEFT JOIN pipeline.article_embeddings e ON a.id = e.article_id
                    WHERE a.status = 'published' AND e.id IS NULL
                    ORDER BY a.id
                """)
            )

        rows = result.mappings().all()
        logger.info("Found %d articles to embed", len(rows))

        if not rows:
            return 0

        if dry_run:
            for r in rows:
                logger.info("[DRY RUN] Would embed article %d: %s", r["id"], r["title"][:60])
            return 0

        # Prepare texts: title + content (truncated)
        texts = []
        article_ids = []
        for r in rows:
            content = r["content"] or r["summary"] or ""
            text_to_embed = f"{r['title']}. {content[:2000]}"
            texts.append(text_to_embed)
            article_ids.append(r["id"])

        # Embed in batches
        logger.info("Embedding %d articles...", len(texts))
        embeddings = embed_batch(texts)
        logger.info("Embedding complete.")

        # Upsert into article_embeddings
        for article_id, embedding in zip(article_ids, embeddings):
            vec_str = "[" + ",".join(str(x) for x in embedding) + "]"
            await db.execute(
                text("""
                    INSERT INTO pipeline.article_embeddings (article_id, embedding, model_name)
                    VALUES (:article_id, CAST(:embedding AS vector), 'all-MiniLM-L6-v2')
                    ON CONFLICT (article_id) DO UPDATE
                    SET embedding = EXCLUDED.embedding, created_at = NOW()
                """),
                {"article_id": article_id, "embedding": vec_str},
            )

        await db.commit()
        logger.info("Saved %d embeddings to database.", len(embeddings))

    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Embed articles for RAG search")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be embedded")
    parser.add_argument("--reembed", action="store_true", help="Re-embed all articles")
    args = parser.parse_args()

    exit_code = asyncio.run(main(dry_run=args.dry_run, reembed=args.reembed))
    sys.exit(exit_code)
