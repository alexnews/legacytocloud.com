# SEO Setup

**Last Updated:** 2026-04-05

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

## Converter SEO (NEW — highest priority)

Target keywords for the converter landing pages:
- "convert csv to mysql online"
- "convert sqlite to postgresql online"
- "convert sql to csv online"
- "convert dbf to excel online"
- "convert excel to sqlite online"
- "online database converter"
- "sql file converter"
- "[source] to [target] converter free"

**Planned:** 200+ SEO landing pages at `/convert/[source]-to-[target]` with format-specific content, tips, and examples. Each page includes the converter widget. See PLAN.md Phase 3.

## Primary Keywords

- **Converter:** online database converter, sql file converter, csv to mysql, sqlite to postgresql
- **Migration:** database migration tool, MySQL/MSSQL/PostgreSQL to Snowflake
- **Portfolio:** data engineering portfolio, real-time finance analytics, stock analytics pipeline
- ClickHouse analytics, FastAPI + PostgreSQL

## Content Strategy

- **Converter pages** target high-intent "[format] to [format] online" queries (highest traffic potential)
- Migration guide pages target long-tail "[source] to Snowflake migration" queries
- News section provides fresh content for crawlers
- Demo dashboard and architecture pages showcase technical depth
- Resource pages (glossary, FAQ, tips) target informational queries
