-- explain select * FROM price_all;


-- create table the_final as 
-- select 
-- price_all.stid,
-- price_all.e5,
-- price_all.e10,
-- price_all.diesel,
-- price_all.date, 
-- gas_station.name, 
-- gas_station.brand, 
-- gas_station.street,
-- gas_station.house_number,
-- gas_station.place,
-- gas_station.lat, 
-- gas_station.lng
-- from price_all left join gas_station on price_all.stid = gas_station.id;

-- select * FROM gas_station limit 1;
-- select * from price_all limit 1;


-- create table average_diesel as 
-- SELECT stid, avg(diesel), cast(date as date) as date from the_final group by stid, cast(date as date) 


-- create index average_diesel_stid on average_diesel(stid)

-- create index average_diesel_date on average_diesel(date)
select * from average_diesel where date = '2017-04-06'


-- create index final_time on the_final(date);
