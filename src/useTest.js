import { useState, useEffect } from 'react';
import { csv } from 'd3';

// const csvUrl =
//   'https://gist.githubusercontent.com/Guilinabaoge/e9296eecbb2067ee2e886e79e09360cb/raw/68363d3047a430761056b2d13da252c49072bc25/test.csv';

const csvUrl = 'https://gist.githubusercontent.com/Guilinabaoge/fcb86a8910b6cd15778bbb87ec3a52e8/raw/259b95ef5897f57af88a1d1fae68deb350a671e0/hchart.csv';

export const useTest = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const row = d => {
        // console.log(Date(data[0]['date']))
        // console.log(Number(data[0]['value']))
        d.date = new Date(d.date)
        d.value = Number(d.value)
        return d;
    };

    csv(csvUrl, row).then(setData);
  }, []);

  return data;
};