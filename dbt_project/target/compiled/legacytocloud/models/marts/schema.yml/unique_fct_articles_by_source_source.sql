
    
    

select
    source as unique_field,
    count(*) as n_records

from "legacytocloud"."pipeline_marts"."fct_articles_by_source"
where source is not null
group by source
having count(*) > 1


