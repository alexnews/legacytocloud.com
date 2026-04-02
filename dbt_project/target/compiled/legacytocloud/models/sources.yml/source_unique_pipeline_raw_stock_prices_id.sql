
    
    

select
    id as unique_field,
    count(*) as n_records

from "legacytocloud"."pipeline"."raw_stock_prices"
where id is not null
group by id
having count(*) > 1


