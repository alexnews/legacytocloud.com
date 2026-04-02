
    
    

select
    week_start as unique_field,
    count(*) as n_records

from "legacytocloud"."pipeline_marts"."fct_weekly_news_summary"
where week_start is not null
group by week_start
having count(*) > 1


