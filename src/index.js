import React, { StrictMode} from 'react';
import { createRoot } from "react-dom/client";
import { scaleSequential, min,max,select, geoMercator, geoPath,interpolateBuGn} from 'd3';
import { useMap } from './useData/useMap';
import { useGas } from './useData/useGas'; 
import { useTest } from './useData/useTest'; 
import { ColorBar } from './ColorBar';
import { HChart} from './horizonMap/HChart';
import {useHex} from './useData/useHex';
import {Hexmap} from './Basemap_Hexbin';
import './overview.css';
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
  if (document.getElementById("horizon_container") !== null &&
      document.getElementById("map_container") !== null &&
     document.getElementById("horizon_container").hasChildNodes() === false &&
     document.getElementById("hexmap_container") !== null 
    //  && document.getElementById("hexmap_container").hasChildNodes() === false
     ) {
    document.getElementById("horizon_container").appendChild(hChart)
    document.getElementById("horizon_container").firstChild.setAttribute("id", "horizon_graph")
    document.getElementById("hexmap_container").appendChild(hexmap)
    document.getElementById("hexmap_container").firstChild.setAttribute("id", "hexmap")
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
  }

  // const basemap = select("#basemap")
  // projected_points.map((d)=>{
  //   basemap.append('circle').attr("cx",`${d.x}`).attr("cy",`${d.y}`).attr("r","1");
  // })


  return (
    <div class="root">
      {/* <text id = "h-title">Germany diesel price change from 2015-2020</text> */}

      <div class="overview_level">
        <div class ="overview_level_child" id="introduction_container">
          <p id="introduction">{`This is an visualization for fuel price of germany during 2015-2020.\nThe horizon graph shows the overview a the whole dataset.
                The hexbin map and live map show the fuel price of specific date. 
                There goals of this visualization are: 
                1. Show the overview of the trend of the gas price. 
                2. Shows the nearby gas stations of a given coordinate, and help user to find the historically cheapest station. 

                Here are the list of interactions in this visualization: 
                1. Swith the fuel type.
                2. Switch the time`}
          </p>
        </div>
        <div class ="overview_level_child" id="horizon_container"></div>
      </div>
      

      <div class="map_level">
        <div class = "map_level_child" id="map_dashboard"></div>
        <div class = "map_level_child" id="hexmap_container">
          
          {/* <input type="range" id="time" min="240" max="1440" /> */}
        </div>
        <div class = "map_level_child" id="map_container" ></div>
        <div class = "map_level_child" id="plot_container" ></div>
      </div>
     

      
      

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
