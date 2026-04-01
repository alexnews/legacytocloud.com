-- Fact: weekly news summary
-- How many articles published per week, by source

WITH articles AS (
    SELECT * FROM {{ ref('stg_articles') }}
)

SELECT
    DATE_TRUNC('week', published_at)::DATE AS week_start,
    COUNT(*) AS articles_published,
    COUNT(DISTINCT source) AS unique_sources,
    ROUND(AVG(quality_score), 1) AS avg_quality,
    ROUND(AVG(word_count)) AS avg_word_count,
    STRING_AGG(DISTINCT source, ', ' ORDER BY source) AS sources_list

FROM articles
WHERE published_at IS NOT NULL
GROUP BY DATE_TRUNC('week', published_at)
ORDER BY week_start DESC
