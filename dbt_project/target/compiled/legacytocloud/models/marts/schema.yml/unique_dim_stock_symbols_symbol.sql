
    
    

select
    symbol as unique_field,
    count(*) as n_records

from "legacytocloud"."pipeline_marts"."dim_stock_symbols"
where symbol is not null
group by symbol
having count(*) > 1


