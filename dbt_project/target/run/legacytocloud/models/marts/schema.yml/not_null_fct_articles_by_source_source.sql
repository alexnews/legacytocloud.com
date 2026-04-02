
    
    select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
    
  
    
    



select source
from "legacytocloud"."pipeline_marts"."fct_articles_by_source"
where source is null



  
  
      
    ) dbt_internal_test