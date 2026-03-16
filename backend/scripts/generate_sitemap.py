"""Generate sitemap.xml with static pages + dynamic news articles.

Usage (from backend directory):
    venv/bin/python -m scripts.generate_sitemap

Writes to www/sitemap.xml (Apache document root).
"""

import asyncio
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env")

SITE = "https://www.legacytocloud.com"
WWW_DIR = Path(__file__).resolve().parent.parent.parent / "www"
TODAY = date.today().isoformat()

STATIC_PAGES = [
    ("/", "weekly", "1.0"),
    ("/demo/dashboard/", "daily", "0.9"),
    ("/demo/architecture/", "monthly", "0.8"),
    ("/news/", "daily", "0.9"),
    ("/services/", "monthly", "0.8"),
    ("/how-it-works/", "monthly", "0.7"),
    ("/features/", "monthly", "0.7"),
    ("/pricing/", "monthly", "0.7"),
    ("/docs/", "monthly", "0.7"),
    ("/about/", "monthly", "0.6"),
    ("/contact/", "monthly", "0.6"),
    ("/mysql-to-snowflake/", "monthly", "0.8"),
    ("/mssql-to-snowflake/", "monthly", "0.8"),
    ("/postgresql-to-snowflake/", "monthly", "0.8"),
    ("/mariadb-to-snowflake/", "monthly", "0.7"),
    ("/aurora-to-snowflake/", "monthly", "0.7"),
    ("/glossary/", "monthly", "0.6"),
    ("/faq/", "monthly", "0.7"),
    ("/tips/", "weekly", "0.7"),
]


async def get_articles() -> list[dict]:
    from app.core.database import async_session
    from sqlalchemy import text

    async with async_session() as db:
        result = await db.execute(
            text("""
                SELECT slug, published_at
                FROM pipeline.articles
                WHERE status = 'published'
                ORDER BY published_at DESC
            """)
        )
        return [{"slug": r[0], "published_at": r[1]} for r in result.fetchall()]


def build_xml(articles: list[dict]) -> str:
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]

    for path, freq, priority in STATIC_PAGES:
        lines.append(f"""  <url>
    <loc>{SITE}{path}</loc>
    <lastmod>{TODAY}</lastmod>
    <changefreq>{freq}</changefreq>
    <priority>{priority}</priority>
  </url>""")

    for art in articles:
        lastmod = art["published_at"].strftime("%Y-%m-%d") if art["published_at"] else TODAY
        lines.append(f"""  <url>
    <loc>{SITE}/news/{art['slug']}/</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>""")

    lines.append("</urlset>")
    return "\n".join(lines)


async def main():
    articles = await get_articles()
    xml = build_xml(articles)

    out_path = WWW_DIR / "sitemap.xml"
    out_path.write_text(xml)
    print(f"Sitemap written: {len(STATIC_PAGES)} static + {len(articles)} articles → {out_path}")

    # Also write to frontend/public so next build includes it
    public_path = Path(__file__).resolve().parent.parent.parent / "frontend" / "public" / "sitemap.xml"
    public_path.write_text(xml)


if __name__ == "__main__":
    asyncio.run(main())
