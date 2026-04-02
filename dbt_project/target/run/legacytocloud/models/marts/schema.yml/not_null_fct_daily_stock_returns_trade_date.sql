
    
    select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
    
  
    
    



select trade_date
from "legacytocloud"."pipeline_marts"."fct_daily_stock_returns"
where trade_date is null



  
  
      
    ) dbt_internal_test