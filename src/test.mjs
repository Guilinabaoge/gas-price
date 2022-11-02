import {Connection} from 'postgresql-client';
import { csv } from 'd3';

const connection = new Connection({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'zxc1012m',
    database: 'postgres',
    timezone: 'Europe/Amsterdam'
});
await connection.connect();
const result = await connection.query(
    "select json_agg(json_build_object('state',states,'diesel',diesel))from (select states, avg(diesel) as diesel from final_gas where date between '2015-01-01' and '2015-05-01' group by states) a");
const rows = result.rows;
console.log(rows)
await connection.close(); // Disconnect



  