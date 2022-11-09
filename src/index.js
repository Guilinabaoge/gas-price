import React, { StrictMode} from 'react';
import { createRoot } from "react-dom/client";
import { scaleSequential, min,max,interpolateBlues,interpolateOranges, geoMercator, geoPath,interpolateBuGn} from 'd3';
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

  const projection = geoMercator()
  // .reflect(true)
  .fitSize([width, height], map)

  const city_info = useHex()

  if (!map|| !gas||!city_info||!test) {
    return <pre>Loading...</pre>;
  }

  const newcity = city_info.map((hi)=>{
   let [x,y] = projection([Number(hi.lat), Number(hi.lng)]);
   let diesel = hi.diesel
   return {diesel,x,y}})
  
  const sort_city = newcity.sort((a, b) => a.diesel - b.diesel)
 
  const path = geoPath(projection);

  const rowByState = new Map();
  gas.forEach(d => {
  	rowByState.set(d.state,d);
  })
  
  const colorValue = d => d.diesel;

  const colorScale = scaleSequential(interpolateBuGn)
		.domain([min(gas,colorValue),max(gas,colorValue)]);


  ColorBar(colorScale);

 
  
  hex(width,height,map,sort_city)
  console.log(sort_city)

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
      <label for="gastype_select">
        Fueltype =
      </label>
      <select id="gastype_select" class="dashboard">
        <option >Diesel</option>
        <option >E5</option>
        <option value="mont">E10</option>
      </select>

      <label for="year_label" id="year_label">
        Year =
      </label>
      <select id="year_select" class="dashboard">
        <option >2015</option>
        <option >2016</option>
        <option >2017</option>
        <option >2018</option>
        <option >2019</option>
        <option >2020</option>
      </select>

      <label for="month_select" id="month_label">
        Month =
      </label>
      <select id="month_select" class="dashboard">
        <option >1</option>
        <option >2</option>
        <option >3</option>
        <option >4</option>
        <option >5</option>
        <option >6</option>
      </select>


      <label for="day_select" id="day_label">
        Day =
      </label>
      <select id="day_select" >
        <option >1</option>
        <option >2</option>
        <option >3</option>
        <option >4</option>
        <option >5</option>
        <option >6</option>
      </select>

      <input type="range" min="1" max="400" value="100" id="myRange"/>
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
