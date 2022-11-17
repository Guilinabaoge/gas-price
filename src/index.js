import React, { StrictMode} from 'react';
import { createRoot } from "react-dom/client";
import { scaleSequential, min,max,select, geoMercator, geoPath,interpolateBuGn} from 'd3';
import { useMap } from './useData/useMap';
import { useGas } from './useData/useGas'; 
import { useTest } from './useData/useTest'; 
import { ColorBar } from './ColorBar'
import { HChart} from './horizonMap/HChart';
import {useHex} from './useData/useHex';
import {Hexmap} from './Basemap_Hexbin';
import {map_live} from './mapbox/mapbox'


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

  let projected_points = city_info.map((d)=>{
    
    const [x, y] = projection([Number(d.lng), Number(d.lat)]);
    let diesel = d.diesel;
    return {diesel,x,y};
  });

  const hexmap = Hexmap(width,height,projection,map,projected_points);


  //TODO refactor 
  if (document.getElementById("hbar") !== null &&
      document.getElementById("map") !== null &&
     document.getElementById("hbar").hasChildNodes() === false &&
     document.getElementById("hexmap") !== null &&
     document.getElementById("hexmap").hasChildNodes() === false
     ) {
    document.getElementById("hbar").appendChild(hChart)
    document.getElementById("hbar").firstChild.classList.add("red")
    document.getElementById("hexmap").appendChild(hexmap)
    map_live()
  } 


  //TODO Fix color bar
  ColorBar(colorScale);

  select("#time").on("input",make_graph);


  //TODO change the slider domain to 2015-01-01 --> 2020-01-01
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

  // const basemap = select("#basemap")
  // projected_points.map((d)=>{
  //   basemap.append('circle').attr("cx",`${d.x}`).attr("cy",`${d.y}`).attr("r","1");
  // })


  return (
    <div class="float-parent-element">
      <text id = "h-title">Germany diesel price change from 2015-2020</text>
      <div class="float-child-element" id="hbar">
      </div>
      <div class="float-child-element" id="hexmap">
      </div>
      <div id="map"  height="600px" ></div>
      

      {/* TODO refactor */}
      {/* <label for="gastype_select">
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
      <input type="range" id="time" min="240" max="1440" /> */}
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
