"""Pull news articles from coollinks MySQL into PostgreSQL pipeline.articles.

Usage (from backend directory):
    venv/bin/python -m scripts.pull_news
    venv/bin/python -m scripts.pull_news --dry-run
    venv/bin/python -m scripts.pull_news --limit 5

Designed to be called from cron. Exits 0 on success, 1 on failure.
"""

import argparse
import asyncio
import hashlib
import logging
import os
import re
import sys
import unicodedata
from datetime import datetime
from pathlib import Path

import httpx
import pymysql
from sqlalchemy import text

# Ensure backend is on the path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

# Load .env from project root
from dotenv import load_dotenv
load_dotenv(backend_dir.parent / ".env")

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def slugify(value: str, max_length: int = 290) -> str:
    """Convert a string to a URL-safe ASCII slug."""
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[^\w\s-]", "", value).strip().lower()
    value = re.sub(r"[-\s]+", "-", value)
    return value[:max_length]


def make_summary(content: str | None, max_length: int = 200) -> str | None:
    """Strip HTML and return first max_length chars as summary."""
    if not content:
        return None
    clean = re.sub(r"<[^>]+>", "", content)
    clean = re.sub(r"\s+", " ", clean).strip()
    if len(clean) <= max_length:
        return clean
    return clean[:max_length].rsplit(" ", 1)[0] + "..."


def download_and_resize_image(url: str, dest_dir: str) -> str | None:
    """Download image, resize to max 1000px width, return filename."""
    try:
        from PIL import Image
        from io import BytesIO
    except ImportError:
        logger.warning("Pillow not installed, skipping image download")
        return None

    if not url:
        return None

    try:
        resp = httpx.get(url, timeout=15, follow_redirects=True)
        resp.raise_for_status()
    except Exception as exc:
        logger.warning("Failed to download image %s: %s", url, exc)
        return None

    # Determine filename from URL hash + extension
    ext = Path(url.split("?")[0]).suffix or ".jpg"
    if ext.lower() not in (".jpg", ".jpeg", ".png", ".webp", ".gif"):
        ext = ".jpg"
    filename = hashlib.md5(url.encode()).hexdigest()[:16] + ext

    dest_path = Path(dest_dir) / filename
    if dest_path.exists():
        return filename

    try:
        img = Image.open(BytesIO(resp.content))
        if img.width > 1000:
            ratio = 1000 / img.width
            new_size = (1000, int(img.height * ratio))
            img = img.resize(new_size, Image.LANCZOS)

        # Convert RGBA to RGB for JPEG
        if img.mode in ("RGBA", "P") and ext.lower() in (".jpg", ".jpeg"):
            img = img.convert("RGB")

        os.makedirs(dest_dir, exist_ok=True)
        img.save(dest_path, quality=85, optimize=True)
        logger.info("Saved image: %s", filename)
        return filename
    except Exception as exc:
        logger.warning("Failed to process image %s: %s", url, exc)
        return None


def ping_indexnow(urls: list[str]) -> None:
    """Ping IndexNow with a list of new URLs."""
    key_file = Path("/usr/local/www/legacytocloud.com/frontend/public/indexnow-key.txt")
    if not key_file.exists():
        logger.info("IndexNow key file not found, skipping ping")
        return

    key = key_file.read_text().strip()
    if not key:
        return

    payload = {
        "host": "legacytocloud.com",
        "key": key,
        "keyLocation": f"https://legacytocloud.com/{key}.txt",
        "urlList": urls,
    }

    try:
        resp = httpx.post(
            "https://api.indexnow.org/indexnow",
            json=payload,
            timeout=10,
        )
        logger.info("IndexNow ping: %d (%d URLs)", resp.status_code, len(urls))
    except Exception as exc:
        logger.warning("IndexNow ping failed: %s", exc)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def get_mysql_connection() -> pymysql.Connection:
    """Connect to coollinks MySQL database."""
    from app.core.config import get_settings
    s = get_settings()
    return pymysql.connect(
        host=s.coollinks_mysql_host,
        port=s.coollinks_mysql_port,
        user=s.coollinks_mysql_user,
        password=s.coollinks_mysql_password,
        database=s.coollinks_mysql_db,
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
    )


def fetch_ready_articles(mysql_conn: pymysql.Connection, site_slug: str, limit: int | None = None) -> list[dict]:
    """Fetch articles from coollinks that are ready to be pulled."""
    sql = """
        SELECT id, title, body, url, source, image_url, quality_score, created_at
        FROM pipeline_articles
        WHERE site = %s AND status = 'ready' AND pulled_at IS NULL
        ORDER BY created_at DESC
    """
    if limit:
        sql += f" LIMIT {int(limit)}"

    with mysql_conn.cursor() as cur:
        cur.execute(sql, (site_slug,))
        return cur.fetchall()


def mark_pulled(mysql_conn: pymysql.Connection, article_ids: list[int]) -> None:
    """Mark articles as pulled in coollinks."""
    if not article_ids:
        return
    placeholders = ",".join(["%s"] * len(article_ids))
    sql = f"UPDATE pipeline_articles SET pulled_at = NOW(), status = 'published' WHERE id IN ({placeholders})"
    with mysql_conn.cursor() as cur:
        cur.execute(sql, article_ids)
    mysql_conn.commit()


async def insert_articles(articles: list[dict], image_dir: str) -> list[dict]:
    """Insert articles into PostgreSQL pipeline.articles, return newly inserted rows."""
    from app.core.database import async_session

    inserted = []

    async with async_session() as db:
        for art in articles:
            title = art["title"]
            slug = slugify(title)
            summary = make_summary(art.get("body"))
            content = art.get("body")
            original_url = art.get("url")
            source = art.get("source")
            quality_score = art.get("quality_score")
            published_at = art.get("created_at")
            pipeline_id = art["id"]

            # Download and resize image
            image_filename = download_and_resize_image(art.get("image_url"), image_dir)
            image_url = f"/uploads/news/{image_filename}" if image_filename else None

            # Insert with ON CONFLICT DO NOTHING
            result = await db.execute(
                text("""
                    INSERT INTO pipeline.articles
                        (pipeline_id, title, slug, content, summary, original_url,
                         source, image_url, quality_score, status, published_at)
                    VALUES
                        (:pipeline_id, :title, :slug, :content, :summary, :original_url,
                         :source, :image_url, :quality_score, 'published', :published_at)
                    ON CONFLICT (pipeline_id) DO NOTHING
                    RETURNING id
                """),
                {
                    "pipeline_id": pipeline_id,
                    "title": title,
                    "slug": slug,
                    "content": content,
                    "summary": summary,
                    "original_url": original_url,
                    "source": source,
                    "image_url": image_url,
                    "quality_score": quality_score,
                    "published_at": published_at,
                },
            )
            row = result.fetchone()
            if row:
                inserted.append({"id": row[0], "slug": slug, "pipeline_id": pipeline_id})
                logger.info("Inserted article %d: %s", pipeline_id, title[:60])
            else:
                logger.info("Skipped (duplicate) article %d: %s", pipeline_id, title[:60])

        await db.commit()

    return inserted


async def main(dry_run: bool = False, limit: int | None = None) -> int:
    from app.core.config import get_settings
    settings = get_settings()

    # Connect to MySQL
    try:
        mysql_conn = get_mysql_connection()
    except Exception as exc:
        logger.error("Cannot connect to coollinks MySQL: %s", exc)
        return 1

    try:
        articles = fetch_ready_articles(mysql_conn, settings.news_site_slug, limit=limit)
        logger.info("Found %d articles ready to pull", len(articles))

        if not articles:
            return 0

        if dry_run:
            for art in articles:
                logger.info("[DRY RUN] Would pull: %d - %s", art["id"], art["title"][:60])
            return 0

        # Insert into PostgreSQL
        inserted = await insert_articles(articles, settings.news_image_dir)

        # Mark pulled in MySQL
        pulled_ids = [row["pipeline_id"] for row in inserted]
        if pulled_ids:
            mark_pulled(mysql_conn, pulled_ids)
            logger.info("Marked %d articles as pulled in coollinks", len(pulled_ids))

        # Ping IndexNow for new URLs
        if inserted:
            new_urls = [f"https://legacytocloud.com/news/{row['slug']}" for row in inserted]
            ping_indexnow(new_urls)

        logger.info("Done. Inserted %d / %d articles.", len(inserted), len(articles))
        return 0

    except Exception as exc:
        logger.error("Pull failed: %s", exc, exc_info=True)
        return 1
    finally:
        mysql_conn.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Pull news articles from coollinks MySQL")
    parser.add_argument("--dry-run", action="store_true", help="Print what would be pulled without writing")
    parser.add_argument("--limit", type=int, default=None, help="Max articles to pull")
    args = parser.parse_args()

    exit_code = asyncio.run(main(dry_run=args.dry_run, limit=args.limit))
    sys.exit(exit_code)
