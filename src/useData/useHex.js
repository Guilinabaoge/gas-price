import { useState, useEffect } from 'react';
import { csv } from 'd3';
import {hexbin} from 'd3-hexbin'
import {App} from './../index.js'

// var csvUrl = 'http://127.0.0.1:5000/hex'
var csvUrl = 'http://127.0.0.1:5000/diesel/2018/11/2'


export const useHex = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    //TODO make the type cast of lng and lat here
    const row = d => {
      d.diesel = Number(d.diesel)
      return d;
    };
    // [Number(d.lng), Number(d.lat)]
    csv(csvUrl, row).then(setData);
  }, []);
  return data;
};


//TODO update hexmap
export function newQuery(year,month,day){
  // console.log(csvUrl)
  csvUrl = `http://127.0.0.1:5000//diesel/${year}/${month}/${day}`
  // console.log(`Year:${year}   Month:${month}   Day:${day}`)
  console.log(this.state)

};

