-- Staging: clean raw stock prices
-- 1:1 with source, just rename and cast

SELECT
    id,
    symbol,
    trade_date,
    open    AS open_price,
    high    AS high_price,
    low     AS low_price,
    close   AS close_price,
    volume,
    source  AS data_source,
    ingested_at
FROM {{ source('pipeline', 'raw_stock_prices') }}
