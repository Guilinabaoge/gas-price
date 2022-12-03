import React, { StrictMode} from 'react';
import { createRoot } from "react-dom/client";
import { scaleSequential, min,max, geoMercator,interpolateBuGn,select,scaleTime,csv} from 'd3';
import { useMap } from './useData/useMap';
import { useTest } from './useData/useTest'; 
import { ColorBar } from './ColorBar';
import { HChart} from './horizonMap/HChart';
import {useHex} from './useData/useHex';
import {Hexmap} from './Basemap_Hexbin';
import './overview.css';
import {map_live} from './mapbox/mapbox'
import {makeLineChart} from './multiLineChart/lineChart'
import { eventHandlers, makeVerticalLine } from './eventHandlers';



const width = 900;
const height = 600;

const App = () => {
  const map = useMap();
  const test = useTest();
  const fuel_price = useHex();

  const projection = geoMercator()
  .fitSize([width, height], map)

  if (!map||!fuel_price||!test) {
    return <pre>Loading...</pre>;
  }


  const hChart = HChart(test,{
    x: d => d.date,
    y: d => d.value,
    z: d => d.name,
  });




  //TODO refactor 
  if (document.getElementById("horizon_container") !== null &&
      document.getElementById("map_container") !== null &&
     document.getElementById("horizon_container").hasChildNodes() === false &&
     document.getElementById("hexmap_container") !== null 
     ) {
    document.getElementById("horizon_container").appendChild(hChart)
    makeHexMap(map,fuel_price)
    map_live(fuel_price)
    makeLineChart()
    makeVerticalLine(projection)
    eventHandlers(projection)
   
  } 


  function makeHexMap(map,fuel_price){
    let projected_points = fuel_price.map((d)=>{
      const [x, y] = projection([Number(d.lng), Number(d.lat)]);
      let diesel = d.diesel;
      return {diesel,x,y}; 
    });
  
    const hexmap = Hexmap(width,height,projection,map,projected_points);
    document.getElementById("hexmap_container").appendChild(hexmap)
    document.getElementById("hexmap_container").firstChild.setAttribute("id", "hexmap")

    const colorValue = d => d.diesel;

    const colorScale = scaleSequential(interpolateBuGn)
		.domain([min(fuel_price,colorValue),max(fuel_price,colorValue)]);

    ColorBar(colorScale);
  }


  select("#horizon_graph")
  .on("click",(event,d)=>{ 
    const mouse_on = timescale.invert(event.screenX);
    const year = mouse_on.getFullYear().toString()
    const month = mouse_on.getMonth().toString()
    const day = mouse_on.getDate().toString()
    const csvUrl = `http://127.0.0.1:5000/diesel/${year}/${month}/${day}`
    
    csv(csvUrl)
    .then(data => {
      data.forEach(d => {
        d.diesel = Number(d.diesel);
      });
      select("#hexmap").remove()
      makeHexMap(map,data)
    });
  });

  const timescale = scaleTime()
      .range([523,1908])
      .domain([new Date().setFullYear(2014,6,8),new Date().setFullYear(2020,10,3)])

  return (
    <div class="root">
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
        <div> 
          <div class ="overview_level_child" id="horizon_container"></div>
          <div id="horizon_legend">horizon_legend</div>
        </div>
       
      </div>
      

      <div class="map_level">
          <div class = "map_level_child" id="hex_wrapper">
              <div class = "map_level_child" id="hexmap_container"></div>
              <div class = "map_level_child">
              </div>
        </div>
        <div class = "map_level_child" id="map_container" ></div>
        <div class = "map_level_child" id="plot_container" >
          <svg id = "line_chart" width="600px" height="300px" transform="translate(280,250) scale(2.5)"></svg>
        </div>
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
