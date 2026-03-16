Here is a **clean Markdown plan** you can save as something like:

`legacy_to_cloud_clickhouse_demo.md`

It is written like a **real project specification** so you can follow it step-by-step.

---

```md
# LegacyToCloud Demo Project
## Real-Time Analytics Pipeline with PostgreSQL, ClickHouse, FastAPI

Author: Alex Kargin  
Goal: Build a **real-world demo pipeline** showing how legacy transactional systems can feed modern analytics systems.

This project demonstrates a modern **OLTP → OLAP architecture** using:

- PostgreSQL (legacy transactional storage)
- ClickHouse (analytics engine)
- Python (data ingestion & transformation)
- FastAPI (API layer)
- Chart.js (dashboard)
- Alpha Vantage API (real external data source)

---

# 1. Project Goal

Create a **real-time analytics system** that:

1. Collects financial data from a public API
2. Stores raw transactional data in PostgreSQL
3. Processes analytical metrics
4. Stores analytical data in ClickHouse
5. Serves data through FastAPI
6. Displays results in a web dashboard

This simulates a **legacy to modern data architecture migration**.

---

# 2. Architecture Overview

```

AlphaVantage API
↓
Python Ingestion Script
↓
PostgreSQL (Raw Data - OLTP)
↓
Python Transformation
↓
ClickHouse (Analytics - OLAP)
↓
FastAPI
↓
Web Dashboard (Chart.js)

```

---

# 3. Technologies Used

| Layer | Tool |
|-----|-----|
| Data Source | Alpha Vantage API |
| Raw Storage | PostgreSQL |
| Analytics Storage | ClickHouse |
| Language | Python |
| API Layer | FastAPI |
| Visualization | Chart.js |
| Scheduler (optional) | Airflow / Cron |
| Libraries | requests, pandas, sqlalchemy |

---

# 4. Data Source

## Alpha Vantage API

Website:
https://www.alphavantage.co

Free tier:

- 500 requests per day
- 25 requests per minute

Example API request:

```

[https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=YOUR_API_KEY](https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=YOUR_API_KEY)

```

Data returned:

- open price
- close price
- high
- low
- volume
- date

---

# 5. Database Design

## PostgreSQL (Raw Data)

This simulates a **legacy transactional system**.

Table:

```

stocks_raw

````

Schema:

```sql
CREATE TABLE stocks_raw (
    id SERIAL PRIMARY KEY,
    symbol TEXT,
    trade_date DATE,
    open NUMERIC,
    high NUMERIC,
    low NUMERIC,
    close NUMERIC,
    volume BIGINT,
    created_at TIMESTAMP DEFAULT now()
);
````

Purpose:
Store **raw API data exactly as received**.

---

## ClickHouse (Analytics)

ClickHouse will store aggregated analytics.

Table:

```
stocks_analytics
```

Schema:

```sql
CREATE TABLE stocks_analytics
(
    symbol String,
    trade_date Date,
    close Float64,
    volume UInt64,
    moving_avg_7 Float64,
    moving_avg_30 Float64
)
ENGINE = MergeTree()
ORDER BY (symbol, trade_date);
```

Purpose:

Fast analytics queries.

---

# 6. Python Data Ingestion

Script:

```
ingest_api_data.py
```

Steps:

1. Call Alpha Vantage API
2. Parse JSON
3. Convert to dataframe
4. Insert into PostgreSQL

Libraries:

```
requests
pandas
psycopg2
sqlalchemy
```

Flow:

```

API → Python → PostgreSQL

```

---

# 7. Data Transformation

Script:

```
transform_to_clickhouse.py
```

Steps:

1. Read data from PostgreSQL
2. Calculate analytics metrics

Examples:

* 7-day moving average
* 30-day moving average
* volume trends

3. Insert processed data into ClickHouse

Flow:

```

Postgres → Python → ClickHouse

```

---

# 8. FastAPI Service

Create API server:

```
api/main.py
```

Install:

```
pip install fastapi uvicorn
```

Endpoints:

## Get stock history

```
GET /stocks/{symbol}
```

Example:

```
/stocks/AAPL
```

Returns:

```
date
price
moving averages
volume
```

## Example Response

```json
[
 {
   "date":"2025-05-01",
   "close":189.3,
   "ma7":187.2,
   "ma30":182.4
 }
]
```

---

# 9. Dashboard

Create simple web dashboard.

Folder:

```
dashboard/
```

Files:

```
index.html
app.js
```

Frontend uses:

* Chart.js
* FastAPI endpoints

Chart examples:

* Stock price
* Moving averages
* Volume

Example chart:

```
Price vs Moving Average
```

---

# 10. Scheduling

Initially run manually.

Later automate using:

Option 1:

```
cron
```

Example:

```
*/30 * * * * python ingest_api_data.py
```

Option 2:

Airflow pipeline.

DAG:

```

fetch_api
↓
store_postgres
↓
transform_data
↓
load_clickhouse

```

---

# 11. Example Analytics Queries

ClickHouse query:

```sql
SELECT
symbol,
trade_date,
close,
moving_avg_7
FROM stocks_analytics
WHERE symbol = 'AAPL'
ORDER BY trade_date;
```

Fast analytics even on millions of rows.

---

# 12. What This Demonstrates

This project demonstrates:

✔ Legacy system ingestion
✔ Data pipeline design
✔ OLTP vs OLAP architecture
✔ ClickHouse analytics
✔ FastAPI microservice
✔ Real-time dashboards

---

# 13. Possible Extensions

Future improvements:

Add multiple stocks

```
AAPL
MSFT
GOOGL
NVDA
```

Add more metrics:

* RSI
* volatility
* trend detection

Add machine learning:

* price prediction
* anomaly detection

---

# 14. Portfolio Value

This demo shows real skills for:

* Data Engineering
* Analytics Engineering
* Platform Engineering
* Legacy → Modern architecture migration

Perfect showcase for:

```
legacytocloud.com
```

---

# 15. Final Result

Public dashboard example:

```
legacytocloud.com/demo/financial-analytics
```

Showing:

* real API data
* modern analytics stack
* full data pipeline

```

---

If you want, when you come back I can also give you **the next level version of this project**, which is MUCH more impressive for employers:

**Airflow + Kafka + ClickHouse pipeline**

And that one can **actually land interviews** because it looks like a real production data platform.
```
