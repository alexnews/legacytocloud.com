
    
    select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
    
  
    
    



select volume
from "legacytocloud"."pipeline"."raw_stock_prices"
where volume is null



  
  
      
    ) dbt_internal_test