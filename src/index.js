import React, { StrictMode} from 'react';
import { createRoot } from "react-dom/client";
import { geoMercator,select,scaleTime,csv} from 'd3';
import { useMap } from './useData/useMap';
import { useTest } from './useData/useTest'; 
import { HChart} from './horizonMap/HChart';
import {useHex} from './useData/useHex';
import {makeHexMap} from './Basemap_Hexbin';
import './overview.css';
import {map_live} from './mapbox/mapbox'
import {makeLineChart} from './multiLineChart/lineChart'
import { eventHandlers, makeVerticalLine } from './eventHandlers';




const width = 900;
const height = 600;

const App = () => {
  const map = useMap();
  const horizon_data = useTest();
  const fuel_price = useHex();

  const projection = geoMercator()
  .fitSize([width, height], map)

  if (!map||!fuel_price||!horizon_data) {
    return <pre>Loading...</pre>;
  }

  const hChart = HChart(horizon_data,{
    x: d => d.date,
    y: d => d.value,
    z: d => d.name,
  });

  const query = `
  select p.avg,p.date,p.stid,c.color from perfect as p, color as c 
  where p.lat=51.353188 and p.lng=11.102475 and c.color_id = 1 
  and p.date between '2018-11-2' and '2018-11-16' 
  union 
  select p.avg,p.date,p.stid,c.color from perfect as p, color as c 
  where p.lat=54.746338 and p.lng=9.894532 and c.color_id = 2 
  and p.date between '2018-11-2' and '2018-11-16' 
  union
  select p.avg,p.date,p.stid,c.color from perfect as p, color as c 
  where p.lat=54.6652 and p.lng=9.9207 and c.color_id = 3
  and p.date between '2018-11-2' and '2018-11-16' 
  union
  select p.avg,p.date,p.stid,c.color from perfect as p, color as c 
  where p.lat=54.65925 and p.lng=9.925332 and c.color_id = 4
  and p.date between '2018-11-2' and '2018-11-16' 
  union
  select p.avg,p.date,p.stid,c.color from perfect as p, color as c 
  where p.lat=54.657238 and p.lng=9.946128 and c.color_id = 5
  and p.date between '2018-11-2' and '2018-11-16' order by date
  `

  //TODO refactor 
  if (document.getElementById("horizon_container") !== null &&
      document.getElementById("map_container") !== null &&
     document.getElementById("horizon_container").hasChildNodes() === false &&
     document.getElementById("hexmap_container") !== null 
     ) {
    document.getElementById("horizon_container").appendChild(hChart)
    makeHexMap(map,fuel_price)
    map_live(fuel_price)
    makeLineChart(query)
    makeVerticalLine(projection)
    eventHandlers(projection)
  } 


  select("#horizon_graph")
  .on("click",(event,d)=>{ 
    const timescale = scaleTime()
      .range([9,1602])
      .domain([new Date().setFullYear(2014,6,8),new Date().setFullYear(2020,10,3)])
    const mouse_on = timescale.invert(event.screenX);
    const year = mouse_on.getFullYear().toString()
    const month = mouse_on.getMonth().toString()
    const day = mouse_on.getDate().toString()
    document.getElementById("dashboard_year").textContent = `Year:${year}`;
    document.getElementById("dashboard_month").textContent = `Month:${(parseInt(month)+1).toString()}`;
    document.getElementById("dashboard_day").textContent = `Day:${day}`;


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



  return (
    <div class="root">
      <div class="overview_level" id = "overview_container">
        <div class ="overview_level_child" id="horizon_container"></div>
        <div class ="overview_level_child" id="introduction_container">
          <div id="horizon_legend_container">
            {/* TODO refactor here so init div and svg in Hchart */}
            <svg height = '100%' id='horizon_legend'></svg>
            {/* <p id="introduction">{introduction}</p> */}
          </div>
         
        </div>
      </div>
      

      <div class="map_level">
          <div class = "map_level_child" id="hex_wrapper">
              <div class = "map_level_child" id="hexmap_container"></div>
              <div class = "map_level_child">
              </div>
        </div>
        <div class = "map_level_child" id="map_container" ></div>
        <div class = "map_level_child" id="plot_container">
        <div class="date_dashboard">
            <div class="one"><p>This dash board displace the which date's data 
              are used for the day level visualization in the hexbinned map. 
              Click the horizon graph to select which day to visualize</p></div>
            <div class="dashboard_item" id="dashboard_year">Year:2018</div>
            <div class="dashboard_item" id="dashboard_month">Month:11</div>
            <div class="dashboard_item" id="dashboard_day">Day:2</div>
          </div>
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
