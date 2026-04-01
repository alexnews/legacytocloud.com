# SEO Setup

**Last Updated:** 2026-03-31

## Verification & Analytics

| Service | Status | ID/Key |
|---------|--------|--------|
| Google Search Console | Verified | Meta tag: `IIy4H76gWeK08tjxtvPHBLCih5k6jWZ4ZzUqNNvCzBY` |
| Bing Webmaster | Verified | Meta tag: `DBF2085FEDD8CDB457C1618B07E65EE1` |
| Google Analytics | Active | G-9TD57H49VG |
| IndexNow | Active | Key file on server, pings on news sync |

## Sitemap

- URL: https://www.legacytocloud.com/sitemap.xml
- Generated dynamically (static pages + news articles)
- Referenced in robots.txt
- Commit: `90ee45b` — dynamic sitemap generator

## Robots.txt

```
User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /api/
Disallow: /_next/
Sitemap: https://www.legacytocloud.com/sitemap.xml
Crawl-delay: 1
```

## Meta Tags (layout.tsx)

- Title: "LegacyToCloud - Real-Time Finance Analytics Pipeline"
- Description: Data engineering portfolio with finance analytics pipeline
- OpenGraph: type website, image /og-image.png
- Twitter: summary_large_image card
- Robots: index, follow, max-image-preview large

## SEO Landing Pages

| Page | URL | Target Keywords |
|------|-----|-----------------|
| MySQL → Snowflake | /mysql-to-snowflake | mysql to snowflake migration |
| MSSQL → Snowflake | /mssql-to-snowflake | sql server to snowflake |
| PostgreSQL → Snowflake | /postgresql-to-snowflake | postgresql to snowflake |
| MariaDB → Snowflake | /mariadb-to-snowflake | mariadb to snowflake migration |
| Aurora → Snowflake | /aurora-to-snowflake | aurora to snowflake migration |
| Glossary | /glossary | database migration glossary |
| FAQ | /faq | database migration faq |
| Tips | /tips | database migration tips |

## News Section SEO

- Articles at /news/[slug] with SEO-friendly slugs
- Share buttons on article pages
- Images downloaded and resized (max 1000px width)
- IndexNow ping on new article sync (Yandex + Bing)

## Primary Keywords

- data engineering portfolio
- real-time finance analytics
- stock analytics pipeline
- database migration tool
- MySQL/MSSQL/PostgreSQL to Snowflake
- ClickHouse analytics
- FastAPI + PostgreSQL

## Content Strategy

- Migration guide pages target long-tail "[source] to Snowflake migration" queries
- News section provides fresh content for crawlers
- Demo dashboard and architecture pages showcase technical depth
- Resource pages (glossary, FAQ, tips) target informational queries
