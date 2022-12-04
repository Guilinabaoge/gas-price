import fetch from "node-fetch"
import pg from "pg"

//get the id of those stations havent got state attribute
async function getStation_id(){
  const client = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'zxc1012m',
    port: 5432,
  })
  client.connect()
    
  var station_id = await new Promise((resolve,reject) => {
    client.query("select * from perfect where state is null limit 1", (err, res) => {
      resolve([res.rows[0].stid,res.rows[0].lat,res.rows[0].lng])
      client.end()
    })
  });
  return station_id  
}

// given coordinate return state
async function reverseGeocoding(lat,lng){
  const url = `http://localhost:4000/geocode?latitude=${lat}&longitude=${lng}`
  const response = await fetch(url)
  var state = null;
  await response.json().then((myJson) => {
    state = myJson[0][0].admin1Code.name
  })
  return new Promise((resolve, reject) => {
    resolve(state)
  })

}

// update state with for each gas station
async function updateState(){
  const client = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'zxc1012m',
    port: 5432,
  })
  let stid = null;
  let lng = null;
  let lat = null;
  let state = null;
  await getStation_id().then((result) => {
    stid = result[0];
    lat = result[1];
    lng = result[2];
  })
  await reverseGeocoding(lat,lng).then((result)=>{state = result})
  console.log(stid)
  console.log(state)

  client.connect()
  
  const update = await new Promise((resolve, reject) => {
    client.query(`update perfect set state = '${state}' where stid = '${stid}'`, (err, res) => {
      resolve("update success")
      client.end()
    })
  })
  return update
}

setInterval(function(){ 
  updateState()
}, 500);





