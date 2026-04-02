
  create view "legacytocloud"."pipeline_staging"."stg_articles__dbt_tmp"
    
    
  as (
    -- Staging: clean raw articles
-- Add computed fields: word count, reading time

SELECT
    id,
    pipeline_id,
    title,
    slug,
    content,
    summary,
    source,
    original_url,
    image_url,
    quality_score,
    status,
    published_at,
    created_at,
    updated_at,

    -- computed fields
    LENGTH(COALESCE(content, '')) AS content_length,
    ARRAY_LENGTH(STRING_TO_ARRAY(COALESCE(content, ''), ' '), 1) AS word_count,
    CEIL(ARRAY_LENGTH(STRING_TO_ARRAY(COALESCE(content, ''), ' '), 1)::NUMERIC / 200) AS reading_time_minutes

FROM "legacytocloud"."pipeline"."articles"
WHERE status = 'published'
  );