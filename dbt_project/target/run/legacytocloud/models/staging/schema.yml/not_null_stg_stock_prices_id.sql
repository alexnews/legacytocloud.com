
    
    select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
    
  
    
    



select id
from "legacytocloud"."pipeline_staging"."stg_stock_prices"
where id is null



  
  
      
    ) dbt_internal_test