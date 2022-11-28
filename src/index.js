import React, { StrictMode} from 'react';
import { createRoot } from "react-dom/client";
import { scaleSequential, min,max,select, geoMercator, selectAll,interpolateBuGn,pointer,scaleTime} from 'd3';
import { useMap } from './useData/useMap';
import { useGas } from './useData/useGas'; 
import { useTest } from './useData/useTest'; 
import { ColorBar } from './ColorBar';
import { HChart} from './horizonMap/HChart';
import {useHex} from './useData/useHex';
import {Hexmap} from './Basemap_Hexbin';
import './overview.css';
import {map_live,addMarker} from './mapbox/mapbox'
import {makeLineChart} from './multiLineChart/lineChart'
import { eventHandlers, makeVerticalLine } from './eventHandlers';



const width = 900;
const height = 600;

const App = () => {
  const map = useMap();
  const test = useTest();
  const fuel_price = useHex()

  const projection = geoMercator()
  .fitSize([width, height], map)

  if (!map||!fuel_price||!test) {
    return <pre>Loading...</pre>;
  }

  const colorValue = d => d.diesel;

  const colorScale = scaleSequential(interpolateBuGn)
		.domain([min(fuel_price,colorValue),max(fuel_price,colorValue)]);

  const hChart = HChart(test,{
    x: d => d.date,
    y: d => d.value,
    z: d => d.name,
  });

  let projected_points = fuel_price.map((d)=>{
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
     ) {
    document.getElementById("horizon_container").appendChild(hChart)
    // document.getElementById("horizon_container").firstChild.setAttribute("id", "horizon_graph")
    document.getElementById("hexmap_container").appendChild(hexmap)
    document.getElementById("hexmap_container").firstChild.setAttribute("id", "hexmap")
    map_live(fuel_price)
    makeLineChart()
    makeVerticalLine(projection)
    eventHandlers(projection)
    ColorBar(colorScale);
  } 


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
        <div class ="overview_level_child" id="horizon_container"></div>
      </div>
      

      <div class="map_level">
          <div class = "map_level_child" id="hex_wrapper">
              <div class = "map_level_child" id="hexmap_container"></div>
              <div class = "map_level_child">
              </div>
              {/* <text>year</text>
              <text>month</text>
              <text>day</text> */}
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
