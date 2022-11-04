import React, { StrictMode,useState, useCallback, useEffect } from 'react';
import { createRoot } from "react-dom/client";
import { interpolateYlOrRd, scaleSequential, min,max,select,format,interpolateBlues,scaleBand,scaleLinear} from 'd3';
import { legendColor } from 'd3-svg-legend';
import { useMap } from './useMap';
import { Marks } from './Marks';
import { useGas } from './useGas'; 
import { useTest } from './useTest'; 
import { ColorBar } from './ColorBar'
import { HorizonChart } from './HorizonChart';
import { HChart} from './HChart';

var margin = {top: 20, right: 20, bottom: 100, left: 60};
const width = 3072;
const height = 1920;

// const width = 2960;
// const height = 2500;


const App = () => {
  const map = useMap();
  const gas = useGas(); 
  const test = useTest();
  

  if (!map|| !gas) {
    return <pre>Loading...</pre>;
  }
  
  const rowByState = new Map();
  gas.forEach(d => {
  	rowByState.set(d.state,d);
  })
  
  const colorValue = d => d.diesel;

  const colorScale = scaleSequential(interpolateBlues)
		.domain([min(gas,colorValue),max(gas,colorValue)]);

  ColorBar(colorScale);

  const hi = HChart(test,{
    x: d => d.date,
    y: d => d.value,
    z: d => d.name
  });

  document.body.appendChild(hi)
  console.log(document.body);
  // let div = document.getElementById("hbar");
  // div.insertAdjacentElement('afterend',hi)
  // console.log(div);

  

  return (
    <div class="float-parent-element">
      <div class="float-child-element" id="hbar" >
      </div>
      <div class="float-child-element">
        <svg class="yellow" width={width} height={height} id="colorbar">
            <g>
                <Marks
                  map={map} 
                  rowByState={rowByState}
                  colorScale = {colorScale}
                  colorValue = {colorValue}
                />
            </g>
        </svg>
      </div>
      

    </div>
    
  );
};



const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
