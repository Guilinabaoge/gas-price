import React, { StrictMode} from 'react';
import { createRoot } from "react-dom/client";
import { scaleSequential, min,max,interpolateBlues,interpolateOranges} from 'd3';
import { useMap } from './useMap';
import { Marks } from './Marks';
import { useGas } from './useGas'; 
import { useTest } from './useTest'; 
import { ColorBar } from './ColorBar'
import { HChart} from './HChart';
import {svgPanZoom} from 'svg-pan-zoom'
import * as tiger from "svg-pan-zoom";


const width = 3072;
const height = 1920;

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

  const colorScale = scaleSequential(interpolateOranges)
		.domain([min(gas,colorValue),max(gas,colorValue)]);

  ColorBar(colorScale);

  const hChart = HChart(test,{
    x: d => d.date,
    y: d => d.value,
    z: d => d.name,
  });


  if (document.getElementById("hbar") !== null && document.getElementById("hbar").hasChildNodes() === false && test!==null) {
    document.getElementById("hbar").appendChild(hChart)
    document.getElementById("hbar").firstChild.classList.add("red")
    // console.log(document.getElementById("hbar").firstChild)
  } 
  
  
  
  return (
    <div class="float-parent-element">
      <text id = "h-title">Germany diesel price change from 2015-2020</text>
      <div class="float-child-element" id="hbar">
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
      <select id="station_select" onchange="update_url()" class="dashboard" transform>
        <option value="plza">Diesel</option>
        <option value="mont">E5</option>
        <option value="mont">E10</option>
      </select>
      <input type="range" min="1" max="400" value="100" class="dashboard" id="myRange"/>
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
