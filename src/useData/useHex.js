import { useState, useEffect } from 'react';
import { csv,select,scaleTime } from 'd3';
import {hexbin} from 'd3-hexbin'
import {App} from './../index.js'


export const useHex = (csvUrl = 'http://127.0.0.1:5000/diesel/2018/11/2') => {
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

