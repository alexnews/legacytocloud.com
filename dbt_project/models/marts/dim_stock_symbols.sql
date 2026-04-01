-- Dimension: one row per stock symbol with summary stats

WITH prices AS (
    SELECT * FROM {{ ref('stg_stock_prices') }}
)

SELECT
    symbol,
    COUNT(*) AS total_trading_days,
    MIN(trade_date) AS first_date,
    MAX(trade_date) AS last_date,
    ROUND(MIN(close_price)::NUMERIC, 2) AS all_time_low,
    ROUND(MAX(close_price)::NUMERIC, 2) AS all_time_high,
    ROUND((ARRAY_AGG(close_price ORDER BY trade_date DESC))[1]::NUMERIC, 2) AS latest_close,
    ROUND(AVG(volume)) AS avg_daily_volume

FROM prices
GROUP BY symbol
ORDER BY symbol
