import { useState, useEffect } from 'react';
import { csv } from 'd3';

const csvUrl = 'http://127.0.0.1:5000/hex'


export const useHex = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const row = d => {
      d.diesel = Number(d.diesel)
      return d;
    };

    csv(csvUrl, row).then(setData);
  }, []);
  return data;
};