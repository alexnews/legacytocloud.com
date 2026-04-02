
    
    select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
    
  
    
    



select week_start
from "legacytocloud"."pipeline_marts"."fct_weekly_news_summary"
where week_start is null



  
  
      
    ) dbt_internal_test