# Architecture

**Last Updated:** 2026-04-05

## Server Layout

```
Server: white (162.217.147.94)
User: dundee
OS: Ubuntu 22.04

Apache (port 80/443)
  ├── Static files: /usr/local/www/legacytocloud.com/www/
  ├── SPA routing: /dashboard/projects/* → index.html
  └── Proxy: /api/* → 127.0.0.1:8003

FastAPI (port 8003, systemd: legacytocloud-api)
  ├── File Converter (upload → convert → download ZIP)
  ├── Auth (JWT, bcrypt)
  ├── Projects CRUD
  ├── Connections (encrypted passwords)
  ├── Schema Analysis
  ├── Pipeline API (stock data from ClickHouse)
  ├── News API (articles from PostgreSQL)
  ├── Chat/RAG API (pgvector + keyword search)
  └── Analytics API

PostgreSQL (native)
  └── Schema: pipeline
      ├── users, projects, connections (app data)
      ├── raw_stock_prices (ingested from Alpha Vantage)
      ├── articles (pulled from Coollinks MySQL)
      └── article_embeddings (pgvector, 384-dim vectors)

ClickHouse (native)
  └── Database: pipeline
      ├── stock_ohlcv
      ├── stock_moving_averages
      └── stock_volume_analysis

Coollinks MySQL (external, same server)
  └── pipeline_articles (WHERE site='legacytocloud.com')
```

## API Endpoints

### File Converter
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/convert/formats | List supported source and target formats |
| POST | /api/convert?outputFormat=X | Upload file, convert, return ZIP |

### Core App
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check (API + DB) |
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | Login (returns JWT) |
| GET | /api/auth/me | Current user profile |
| GET/POST | /api/projects | List/create projects |
| GET/PUT/DELETE | /api/projects/{id} | Project CRUD |
| GET/POST | /api/connections | List/create connections |
| POST | /api/connections/test | Test unsaved connection |
| POST | /api/connections/{id}/test | Test saved connection |
| POST | /api/analysis/upload | Upload .sql file for analysis |
| POST | /api/analysis/quick | Quick schema analysis |
| POST | /api/analysis/{id}/run | Run full analysis |
| GET | /api/analysis/{id} | Get analysis results |

### Pipeline (Finance Demo)
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/pipeline/summary | Stock summary cards |
| GET | /api/pipeline/prices | OHLCV price data |
| GET | /api/pipeline/indicators | Technical indicators |
| GET | /api/pipeline/health | Pipeline health status |
| GET | /api/pipeline/runs | Pipeline run history |

### News
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/news | Paginated article list |
| GET | /api/news/{slug} | Single article by slug |
| GET | /api/news/sources | Distinct sources with counts |

### Chat / RAG
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/chat/status | Embedding count, Ollama status |
| POST | /api/chat | RAG chat (SSE stream): vector search → keyword fallback → article summaries |

### Analytics
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/analytics/* | Analytics dashboard data |

## Database Tables

### PostgreSQL (schema: pipeline)

**users** — App users (email, hashed_password, created_at)
**projects** — Migration projects (name, description, owner_id)
**connections** — Database connections (host, port, db_name, encrypted_password, db_type: mysql/postgresql/mssql)
**raw_stock_prices** — Ingested stock data (symbol, trade_date, OHLCV)
**articles** — News articles pulled from Coollinks (pipeline_id, title, slug, content, summary, source, image_url, quality_score, status, published_at)
**article_embeddings** — pgvector embeddings for RAG (article_id, embedding vector(384), model_name)
**pipeline_runs** — ETL run tracking (run_type, status, rows_processed, error_message)

### ClickHouse (database: pipeline)

**stock_ohlcv** — Daily OHLCV data per symbol
**stock_moving_averages** — SMA 5/10/20/50/200, EMA 12/26
**stock_volume_analysis** — Volume metrics, VWAP, relative volume

## Data Pipelines

### Stock Data Pipeline
1. **Ingest**: Alpha Vantage API → PostgreSQL `raw_stock_prices`
2. **Transform**: PostgreSQL → pandas (calculate indicators) → ClickHouse (3 tables)
3. **Serve**: ClickHouse → FastAPI → Next.js dashboard
4. **Refresh**: Cron runs `scripts/refresh_pipeline.py` weekdays at 18:00

### News Pipeline
1. **Source**: Coollinks MySQL `pipeline_articles` (site='legacytocloud.com', status='ready')
2. **Pull**: `scripts/pull_news.py` downloads images, resizes to 1000px, inserts into PostgreSQL
3. **Mark**: Updates Coollinks status='published', pulled_at=NOW()
4. **Notify**: Pings IndexNow (Yandex + Bing) for new URLs
5. **Refresh**: Cron runs `pull_news.py` weekdays at 18:05

## External Integrations

| Service | Purpose | Config |
|---------|---------|--------|
| Alpha Vantage | Stock market data | ALPHA_VANTAGE_API_KEY in .env |
| Coollinks MySQL | News article source | COOLLINKS_MYSQL_* in .env |
| Google Analytics | Traffic tracking | G-9TD57H49VG |
| Google Search Console | SEO monitoring | Meta tag verification |
| Bing Webmaster | SEO monitoring | Meta tag verification |
| IndexNow | Instant URL indexing | Key file on server |
| Let's Encrypt | SSL certificates | Auto-renewed via certbot |

## Key Directories

```
legacytocloud.com/
├── backend/
│   ├── app/
│   │   ├── api/           # health, auth, projects, connections, analysis, analytics
│   │   ├── converter/     # File conversion engine
│   │   │   ├── router.py         # POST /api/convert endpoint
│   │   │   ├── detect.py         # Format detection + target aliases
│   │   │   ├── models.py         # ConvertedData, TableData, ColumnInfo
│   │   │   ├── readers.py        # CSV, Excel, SQLite, SQL dump, DBF readers
│   │   │   └── writers.py        # CSV, XLSX, MySQL, PostgreSQL, SQLite writers
│   │   ├── core/          # config, database, security, encryption
│   │   ├── models/        # SQLAlchemy models
│   │   ├── pipeline/      # stock pipeline (ingest, transform, clickhouse)
│   │   │   ├── router.py         # /api/pipeline/* endpoints
│   │   │   ├── news_router.py    # /api/news/* endpoints
│   │   │   ├── news_models.py    # Article model
│   │   │   ├── ingest.py         # Alpha Vantage ingestion
│   │   │   ├── transform.py      # PG → ClickHouse transform
│   │   │   └── clickhouse.py     # ClickHouse client
│   │   ├── rag/           # RAG chat (embedder, retriever, llm_client, chat_router)
│   │   └── services/      # db_connector, schema_analyzer, sql_parser, ddl_generator
│   ├── alembic/           # database migrations (001-005)
│   └── scripts/           # pull_news.py, refresh_pipeline.py, embed_articles.py
├── dbt_project/           # dbt models (staging + marts), exercises
├── frontend/
│   └── src/
│       ├── app/           # Next.js pages (convert, chat, analytics, news, demo, SEO)
│       ├── components/    # SiteHeader, SiteFooter, DashboardLayout, pipeline/*
│       ├── lib/           # api.ts, news-api.ts, chat-api.ts, analytics-api.ts
│       └── types/         # TypeScript types
├── config/
│   ├── apache/            # legacytocloud.conf, legacytocloud-prod.conf
│   └── systemd/           # legacytocloud-api.service
├── www/                   # Built frontend output (served by Apache)
├── docs/                  # Project documentation
└── steps/                 # Legacy session logs (archive)
```

## Finance Analytics Pipeline Spec

The demo pipeline is based on a detailed spec in `docs/finance_analytic.md`. It demonstrates a real-world OLTP → OLAP architecture using PostgreSQL as the transactional store and ClickHouse as the analytics engine, with Python handling ingestion and transformation.
