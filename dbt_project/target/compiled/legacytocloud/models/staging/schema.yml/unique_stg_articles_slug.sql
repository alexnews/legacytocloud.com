
    
    

select
    slug as unique_field,
    count(*) as n_records

from "legacytocloud"."pipeline_staging"."stg_articles"
where slug is not null
group by slug
having count(*) > 1


