import { useState, useEffect } from 'react';
import { csv } from 'd3';
import {projection} from './Marks';

const csvUrl = 'http://127.0.0.1:5000/hex'


export const useHex = (projection) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const row = d => {
      let [x,y] = projection([Number(d.lat),Number(d.lng)]);
      d.x = x;
      d.y = y;
      d.lat = Number(d.lat)
      d.lng = Number(d.lng)
      d.diesel = Number(d.diesel)
        return d;
    };

    csv(csvUrl, row).then(setData);
  }, []);
  // console.log(data)
  return data;
};