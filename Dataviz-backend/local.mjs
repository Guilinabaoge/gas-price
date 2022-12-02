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
    
  client.query("select * from perfect where state is null limit 1", (err, res) => {
    const state = 
    showRows(res.rows[0].lat,res.rows[0].lng).then((d)=>{return d.json()})
    .then((myJson) => {
      const stid = res.rows[0].stid
      const state = myJson[0][0].admin1Code.name
      updateState(state,stid)
      // console.log(`update perfect set state = '${state}' where stid = '${stid}'`)
    }
    )
    client.end()
  })
}

async function showRows(lat,lng){
  const url = `http://localhost:4000/geocode?latitude=${lat}&longitude=${lng}`
  const response = await fetch(url)
  return response
}

async function updateState(state,stid){
  const client = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'zxc1012m',
    port: 5432,
  })
  client.connect()
    
  client.query(`update perfect set state = '${state}' where stid = '${stid}'`, (err, res) => {
    console.log("update success")
    client.end()
  })
}

//why cannot invoke inside for loop?
// getStates()
while (true){
  getStates()
}




function wait(ms) {
  var start = Date.now(),
      now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}


