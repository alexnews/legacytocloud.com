CREATE DATABASE IF NOT EXISTS pipeline;

CREATE TABLE IF NOT EXISTS pipeline.stock_ohlcv (
    symbol String,
    trade_date Date,
    open Float64,
    high Float64,
    low Float64,
    close Float64,
    volume UInt64,
    daily_return Float64,
    intraday_range Float64,
    updated_at DateTime DEFAULT now()
) ENGINE = ReplacingMergeTree(updated_at)
ORDER BY (symbol, trade_date);

CREATE TABLE IF NOT EXISTS pipeline.stock_moving_averages (
    symbol String,
    trade_date Date,
    sma_20 Float64,
    sma_50 Float64,
    ema_12 Float64,
    ema_26 Float64,
    macd Float64,
    macd_signal Float64,
    macd_histogram Float64,
    rsi_14 Float64,
    updated_at DateTime DEFAULT now()
) ENGINE = ReplacingMergeTree(updated_at)
ORDER BY (symbol, trade_date);

CREATE TABLE IF NOT EXISTS pipeline.stock_volume_analysis (
    symbol String,
    trade_date Date,
    volume UInt64,
    avg_volume_20 Float64,
    volume_ratio Float64,
    updated_at DateTime DEFAULT now()
) ENGINE = ReplacingMergeTree(updated_at)
ORDER BY (symbol, trade_date)
