-- Fact: daily stock returns with moving averages

WITH prices AS (
    SELECT * FROM "legacytocloud"."pipeline_staging"."stg_stock_prices"
),

with_returns AS (
    SELECT
        symbol,
        trade_date,
        open_price,
        high_price,
        low_price,
        close_price,
        volume,

        -- Daily return
        ROUND(
            ((close_price - LAG(close_price) OVER (PARTITION BY symbol ORDER BY trade_date))
            / NULLIF(LAG(close_price) OVER (PARTITION BY symbol ORDER BY trade_date), 0)
            * 100)::NUMERIC,
            2
        ) AS daily_return_pct,

        -- Moving averages
        ROUND(AVG(close_price) OVER (PARTITION BY symbol ORDER BY trade_date ROWS 4 PRECEDING)::NUMERIC, 2) AS sma_5,
        ROUND(AVG(close_price) OVER (PARTITION BY symbol ORDER BY trade_date ROWS 19 PRECEDING)::NUMERIC, 2) AS sma_20,
        ROUND(AVG(close_price) OVER (PARTITION BY symbol ORDER BY trade_date ROWS 49 PRECEDING)::NUMERIC, 2) AS sma_50,

        -- Volume average
        ROUND(AVG(volume) OVER (PARTITION BY symbol ORDER BY trade_date ROWS 19 PRECEDING)) AS avg_volume_20d,

        -- High/Low range
        ROUND((high_price - low_price)::NUMERIC, 2) AS daily_range,

        data_source,
        ingested_at

    FROM prices
)

SELECT * FROM with_returns