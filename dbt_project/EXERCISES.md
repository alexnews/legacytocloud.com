# dbt Practice Exercises — Using Your Real Data

Every exercise follows the same loop:
1. Read the question
2. Create a new .sql file in `models/marts/`
3. Run `dbt run`
4. Check the result on your analytics dashboard (legacytocloud.com/analytics)

To run:
```bash
cd dbt_project
source venv/bin/activate
dbt run
```

Your data:
- 453 news articles (title, source, content, published_at, quality_score, image_url)
- 400 stock prices (symbol: AAPL/MSFT/JPM/GS, trade_date, open, high, low, close, volume)

---

## Exercise 1: Count articles per month (GROUP BY)

**Question:** How many articles were published each month?

**Create file:** `models/marts/ex01_articles_per_month.sql`

**Hint:** Use `DATE_TRUNC('month', published_at)` to group by month, `COUNT(*)` to count.

**Try it yourself first, then check below.**

<details>
<summary>Answer</summary>

```sql
SELECT
    DATE_TRUNC('month', published_at)::DATE AS month,
    COUNT(*) AS article_count
FROM {{ ref('stg_articles') }}
WHERE published_at IS NOT NULL
GROUP BY DATE_TRUNC('month', published_at)
ORDER BY month DESC
```

</details>

**What you learned:** GROUP BY with date truncation — the most common analytics pattern.

---

## Exercise 2: Top 5 sources by article count (GROUP BY + LIMIT)

**Question:** Which 5 news sources publish the most? Show source name and count.

**Create file:** `models/marts/ex02_top_sources.sql`

**Hint:** `GROUP BY source`, `ORDER BY count DESC`, `LIMIT 5`

<details>
<summary>Answer</summary>

```sql
SELECT
    source,
    COUNT(*) AS article_count
FROM {{ ref('stg_articles') }}
WHERE source IS NOT NULL
GROUP BY source
ORDER BY article_count DESC
LIMIT 5
```

</details>

**What you learned:** Sorting aggregations to find "top N" — used in every dashboard.

---

## Exercise 3: Average stock price per month (GROUP BY + AVG)

**Question:** What was the average closing price for each stock, each month?

**Create file:** `models/marts/ex03_monthly_avg_price.sql`

**Hint:** Group by both `symbol` AND `DATE_TRUNC('month', trade_date)`.

<details>
<summary>Answer</summary>

```sql
SELECT
    symbol,
    DATE_TRUNC('month', trade_date)::DATE AS month,
    ROUND(AVG(close_price)::NUMERIC, 2) AS avg_close,
    ROUND(MIN(close_price)::NUMERIC, 2) AS month_low,
    ROUND(MAX(close_price)::NUMERIC, 2) AS month_high,
    SUM(volume) AS total_volume
FROM {{ ref('stg_stock_prices') }}
GROUP BY symbol, DATE_TRUNC('month', trade_date)
ORDER BY symbol, month DESC
```

</details>

**What you learned:** Multi-column GROUP BY — essential for any time-series analytics.

---

## Exercise 4: Daily price change (LAG window function)

**Question:** For each stock and each day, show yesterday's close and today's price change in dollars.

**Create file:** `models/marts/ex04_daily_price_change.sql`

**Hint:** `LAG(close_price) OVER (PARTITION BY symbol ORDER BY trade_date)`

<details>
<summary>Answer</summary>

```sql
SELECT
    symbol,
    trade_date,
    close_price,
    LAG(close_price) OVER (PARTITION BY symbol ORDER BY trade_date) AS prev_close,
    ROUND(
        (close_price - LAG(close_price) OVER (PARTITION BY symbol ORDER BY trade_date))::NUMERIC,
        2
    ) AS price_change
FROM {{ ref('stg_stock_prices') }}
ORDER BY symbol, trade_date DESC
```

</details>

**What you learned:** LAG() — look at the previous row. The most important window function.

---

## Exercise 5: Running total of articles (SUM window function)

**Question:** Show a running total — for each article (ordered by date), how many total articles have been published so far?

**Create file:** `models/marts/ex05_running_article_count.sql`

**Hint:** `SUM(1) OVER (ORDER BY published_at)` or `ROW_NUMBER()`

<details>
<summary>Answer</summary>

```sql
SELECT
    id,
    title,
    source,
    published_at,
    ROW_NUMBER() OVER (ORDER BY published_at) AS article_number,
    SUM(1) OVER (ORDER BY published_at) AS running_total
FROM {{ ref('stg_articles') }}
WHERE published_at IS NOT NULL
ORDER BY published_at
```

</details>

**What you learned:** Running totals with SUM() OVER — used in cumulative charts.

---

## Exercise 6: Rank sources by article count (RANK window function)

**Question:** Rank all news sources by their article count. Show rank, source, and count.

**Create file:** `models/marts/ex06_source_ranking.sql`

**Hint:** First aggregate with GROUP BY, then use `RANK() OVER (ORDER BY ...)`.

<details>
<summary>Answer</summary>

```sql
WITH source_counts AS (
    SELECT
        source,
        COUNT(*) AS article_count
    FROM {{ ref('stg_articles') }}
    WHERE source IS NOT NULL
    GROUP BY source
)

SELECT
    RANK() OVER (ORDER BY article_count DESC) AS rank,
    source,
    article_count
FROM source_counts
ORDER BY rank
```

</details>

**What you learned:** RANK() — used in leaderboards, "top performers" dashboards.

---

## Exercise 7: 5-day moving average (ROWS PRECEDING)

**Question:** Calculate a 5-day moving average of closing price for each stock.

**Create file:** `models/marts/ex07_moving_average.sql`

**Hint:** `AVG(close_price) OVER (PARTITION BY symbol ORDER BY trade_date ROWS 4 PRECEDING)`

Why 4? Because the current row + 4 preceding = 5 rows total.

<details>
<summary>Answer</summary>

```sql
SELECT
    symbol,
    trade_date,
    close_price,
    ROUND(
        AVG(close_price) OVER (
            PARTITION BY symbol
            ORDER BY trade_date
            ROWS 4 PRECEDING
        )::NUMERIC,
        2
    ) AS sma_5
FROM {{ ref('stg_stock_prices') }}
ORDER BY symbol, trade_date DESC
```

</details>

**What you learned:** Moving averages with ROWS PRECEDING — core of financial analytics.

---

## Exercise 8: Articles with no images, by source (CASE WHEN + GROUP BY)

**Question:** For each source, how many articles have images vs don't? Show both counts and percentage.

**Create file:** `models/marts/ex08_image_coverage.sql`

**Hint:** `COUNT(CASE WHEN image_url IS NOT NULL THEN 1 END)` counts only rows where condition is true.

<details>
<summary>Answer</summary>

```sql
SELECT
    source,
    COUNT(*) AS total,
    COUNT(CASE WHEN image_url IS NOT NULL THEN 1 END) AS with_image,
    COUNT(CASE WHEN image_url IS NULL THEN 1 END) AS without_image,
    ROUND(
        COUNT(CASE WHEN image_url IS NOT NULL THEN 1 END)::NUMERIC
        / COUNT(*) * 100,
        1
    ) AS image_pct
FROM {{ ref('stg_articles') }}
WHERE source IS NOT NULL
GROUP BY source
ORDER BY total DESC
```

</details>

**What you learned:** Conditional aggregation — counting subsets within groups.

---

## Exercise 9: Best and worst stock day (FIRST_VALUE / LAST_VALUE)

**Question:** For each stock, find the date with the highest closing price and the date with the lowest.

**Create file:** `models/marts/ex09_best_worst_days.sql`

**Hint:** Use a CTE with `RANK()` partitioned by symbol, ordered by close_price.

<details>
<summary>Answer</summary>

```sql
WITH ranked AS (
    SELECT
        symbol,
        trade_date,
        close_price,
        RANK() OVER (PARTITION BY symbol ORDER BY close_price DESC) AS best_rank,
        RANK() OVER (PARTITION BY symbol ORDER BY close_price ASC) AS worst_rank
    FROM {{ ref('stg_stock_prices') }}
)

SELECT
    symbol,
    MAX(CASE WHEN best_rank = 1 THEN trade_date END) AS best_day,
    MAX(CASE WHEN best_rank = 1 THEN close_price END) AS highest_price,
    MAX(CASE WHEN worst_rank = 1 THEN trade_date END) AS worst_day,
    MAX(CASE WHEN worst_rank = 1 THEN close_price END) AS lowest_price
FROM ranked
GROUP BY symbol
ORDER BY symbol
```

</details>

**What you learned:** Combining RANK() with conditional aggregation — finding "the row where X is max/min."

---

## Exercise 10: Stock vs News correlation (JOIN between domains)

**Question:** For each week, show the number of articles published AND the average stock return for AAPL. Do weeks with more news correlate with bigger price moves?

**Create file:** `models/marts/ex10_news_vs_stocks.sql`

**Hint:** Join weekly news summary with weekly stock returns. Use `DATE_TRUNC('week', ...)` on both sides.

<details>
<summary>Answer</summary>

```sql
WITH weekly_news AS (
    SELECT
        DATE_TRUNC('week', published_at)::DATE AS week_start,
        COUNT(*) AS articles_published
    FROM {{ ref('stg_articles') }}
    WHERE published_at IS NOT NULL
    GROUP BY DATE_TRUNC('week', published_at)
),

weekly_stocks AS (
    SELECT
        DATE_TRUNC('week', trade_date)::DATE AS week_start,
        ROUND(AVG(close_price)::NUMERIC, 2) AS avg_close,
        ROUND((MAX(close_price) - MIN(close_price))::NUMERIC, 2) AS price_range,
        SUM(volume) AS total_volume
    FROM {{ ref('stg_stock_prices') }}
    WHERE symbol = 'AAPL'
    GROUP BY DATE_TRUNC('week', trade_date)
)

SELECT
    COALESCE(n.week_start, s.week_start) AS week_start,
    n.articles_published,
    s.avg_close AS aapl_avg_close,
    s.price_range AS aapl_price_range,
    s.total_volume AS aapl_volume
FROM weekly_news n
FULL OUTER JOIN weekly_stocks s ON n.week_start = s.week_start
ORDER BY week_start DESC
```

</details>

**What you learned:** Joining data from different domains — the whole point of a data warehouse.

---

## The Loop

For each exercise:
1. Create the .sql file in `models/marts/`
2. `dbt run --select ex01_articles_per_month` (runs just that one model)
3. Check the result: go to your analytics page or query the table directly
4. Move to the next exercise

After all 10, you'll have written: GROUP BY, COUNT, AVG, SUM, LAG, RANK, ROW_NUMBER, moving averages, CASE WHEN, CTEs, JOINs, DATE_TRUNC. That covers 90% of what analytics SQL is.
