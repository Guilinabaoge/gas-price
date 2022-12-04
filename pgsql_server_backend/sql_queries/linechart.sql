-- create index perfect_coordinate on perfect(lat,lng);

select avg,date,stid from perfect where lat=51.430709 and lng=8.002618
and date between '2015-1-1' and '2015-1-15'
union 
select avg,date,stid from perfect where lat=51.42032 and lng=8.040306
and date between '2015-1-1' and '2015-1-15'
union
select avg,date,stid from perfect where lat=51.40164 and lng=8.05985
and date between '2015-1-1' and '2015-1-15'
union
select avg,date,stid from perfect where lat=51.4104958 and lng=8.054933
and date between '2015-1-1' and '2015-1-15'
union
select avg,date,stid from perfect where lat=51.4205 and lng=7.9903
and date between '2015-1-1' and '2015-1-15' order by date

-- select max(avg) from perfect

-- delete from perfect where avg < 800