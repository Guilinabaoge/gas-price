import React, { StrictMode} from 'react';
import { createRoot } from "react-dom/client";
import { scaleSequential, min,max,select, geoMercator, geoPath,interpolateBuGn} from 'd3';
import { useMap } from './useMap';
import { useGas } from './useGas'; 
import { useTest } from './useTest'; 
import { ColorBar } from './ColorBar'
import { HChart} from './HChart';
import {svgPanZoom} from 'svg-pan-zoom';
import * as tiger from "svg-pan-zoom";
import {useHex} from './useHex';
import {Hexmap} from './Marks';



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


  

  const hChart = HChart(test,{
    x: d => d.date,
    y: d => d.value,
    z: d => d.name,
  });

  const hexmap = Hexmap(width,height,projection,map,sort_city);


  //TODO refactor 
  if (document.getElementById("hbar") !== null && document.getElementById("hbar").hasChildNodes() === false) {
    document.getElementById("hbar").appendChild(hChart)
    document.getElementById("hbar").firstChild.classList.add("red")
  } 

  if (document.getElementById("hexmap") !== null && document.getElementById("hexmap").hasChildNodes() === false){
    document.getElementById("hexmap").appendChild(hexmap)
  }

  //Fix color bar
  ColorBar(colorScale);


  select("#time").on("input",make_graph);

  function update_slider(time) {
    var dateObj = new Date();
    dateObj.setHours(Math.floor(time/60));
    dateObj.setMinutes(time % 60);
    select("#prettyTime")
      .text(dateObj.toTimeString().substring(0, 5));
  }


  //TODO scroll bar
  function make_graph(){
    update_slider(+document.getElementById("time").value)
    console.log("Hi")
  }
  
  
  return (
    <div class="float-parent-element">
      <text id = "h-title">Germany diesel price change from 2015-2020</text>
      <div class="float-child-element" id="hbar">
      </div>
      <div class="float-child-element" id="hexmap">
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


      <label for="time">
         Time = <span id="prettyTime">...</span>
       </label>
      <input type="range" id="time" min="240" max="1440" />
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
