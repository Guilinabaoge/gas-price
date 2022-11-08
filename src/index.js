import React, { StrictMode} from 'react';
import { createRoot } from "react-dom/client";
import { scaleSequential, min,max,interpolateBlues,interpolateOranges, geoMercator,geoIdentity, geoPath,} from 'd3';
import { useMap } from './useMap';
import { Marks,hex } from './Marks';
import { useGas } from './useGas'; 
import { useTest } from './useTest'; 
import { ColorBar } from './ColorBar'
import { HChart} from './HChart';
import {svgPanZoom} from 'svg-pan-zoom'
import * as tiger from "svg-pan-zoom";
import {useHex} from './useHex'



const width = 900;
const height = 600;

const App = () => {
  const map = useMap();
  const gas = useGas(); 
  const test = useTest();

  const projection = geoIdentity()
  .reflectY(true)
  .fitSize([width, height], map)

  const city_info = useHex(projection)

  if (!map|| !gas||!city_info||!test) {
    return <pre>Loading...</pre>;
  }
  


	// .center([10.40, 53.31])
  // .scale([height]);
  const path = geoPath(projection);


  console.log(city_info);



  const rowByState = new Map();
  gas.forEach(d => {
  	rowByState.set(d.state,d);
  })
  
  const colorValue = d => d.diesel;

  const colorScale = scaleSequential(interpolateOranges)
		.domain([min(gas,colorValue),max(gas,colorValue)]);


  // ColorBar(colorScale);

 
  
  hex(map,city_info)

  const hChart = HChart(test,{
    x: d => d.date,
    y: d => d.value,
    z: d => d.name,
  });


  if (document.getElementById("hbar") !== null && document.getElementById("hbar").hasChildNodes() === false && test!==null) {
    document.getElementById("hbar").appendChild(hChart)
    document.getElementById("hbar").firstChild.classList.add("red")
  } 
  
  
  return (
    <div class="float-parent-element">
      <text id = "h-title">Germany diesel price change from 2015-2020</text>
      <div class="float-child-element" id="hbar">
      </div>
      <div class="float-child-element" id="test">
        <svg class="yellow" width={width} height={height} id="colorbar">
            <g id = "map_container">
                <Marks 
                  map={map} 
                  path = {path}
                  rowByState={rowByState}
                  colorScale = {colorScale}
                  colorValue = {colorValue}
                />
            </g>
        </svg>
      </div>
      <select id="gastype_select" class="dashboard">
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
