import fetch from "node-fetch"
import pg from "pg"


var rows = null



async function getStates(){
  const client = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'zxc1012m',
    port: 5432,
  })
  client.connect()
    
  client.query('select * from perfect where state is null limit 1', (err, res) => {
    rows = res.rows
    const state = showRows()
    client.end()
  })
}

getStates()

async function showRows(){
  const url = 'http://localhost:4000/geocode?latitude=50.485900878906&longitude=9.7160587310791'
  const response = 
  await fetch(url).then((d)=>{return d.json()}).then((myJson)=> console.log(myJson[0][0].admin1Code))
  return response
}


