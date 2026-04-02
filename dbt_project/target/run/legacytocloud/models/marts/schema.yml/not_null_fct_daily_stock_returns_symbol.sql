
    
    select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
    
  
    
    



select symbol
from "legacytocloud"."pipeline_marts"."fct_daily_stock_returns"
where symbol is null



  
  
      
    ) dbt_internal_test