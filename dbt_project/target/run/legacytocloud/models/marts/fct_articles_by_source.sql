
  
    

  create  table "legacytocloud"."pipeline_marts"."fct_articles_by_source__dbt_tmp"
  
  
    as
  
  (
    -- Fact: article analytics grouped by source
-- How many articles per source, avg quality, avg length

WITH articles AS (
    SELECT * FROM "legacytocloud"."pipeline_staging"."stg_articles"
)

SELECT
    source,
    COUNT(*) AS total_articles,
    ROUND(AVG(quality_score), 1) AS avg_quality_score,
    ROUND(AVG(word_count)) AS avg_word_count,
    ROUND(AVG(reading_time_minutes), 1) AS avg_reading_time,
    MIN(published_at) AS first_article_at,
    MAX(published_at) AS last_article_at,
    COUNT(CASE WHEN image_url IS NOT NULL THEN 1 END) AS articles_with_images,
    ROUND(
        COUNT(CASE WHEN image_url IS NOT NULL THEN 1 END)::NUMERIC / NULLIF(COUNT(*), 0) * 100,
        1
    ) AS image_coverage_pct

FROM articles
WHERE source IS NOT NULL
GROUP BY source
ORDER BY total_articles DESC
  );
  