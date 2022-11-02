import { useState, useEffect } from 'react';
import { csv } from 'd3';

// const csvUrl =
//   'https://gist.githubusercontent.com/Guilinabaoge/e9296eecbb2067ee2e886e79e09360cb/raw/68363d3047a430761056b2d13da252c49072bc25/test.csv';

const csvUrl = 'http://127.0.0.1:5000/states';

export const useGas = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const row = d => {
      // d.latitude = parseFloat(d.latitude.replace(',', '.'));
      // d.longitude = parseFloat(d.longitude.replace(',', '.'));
      d.diesel = parseFloat(d.diesel.replace(',', '.'));
      return d;
    };
    csv(csvUrl, row).then(setData);
  }, []);
  return data;
};
