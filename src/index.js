import React, { StrictMode} from 'react';
import { createRoot } from "react-dom/client";
import { scaleSequential, min,max, geoMercator,interpolateBuGn,select,scaleTime,csv} from 'd3';
import { useMap } from './useData/useMap';
import { useTest } from './useData/useTest'; 
import { ColorBar } from './ColorBar';
import { HChart} from './horizonMap/HChart';
import {useHex} from './useData/useHex';
import {Hexmap,makeHexMap} from './Basemap_Hexbin';
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
  
  // `
  // select avg,date,stid from perfect where lat=51.430709 and lng=8.002618
  //   and date between '2015-1-1' and '2015-1-15'
  //   union 
  //   select avg,date,stid from perfect where lat=51.42032 and lng=8.040306
  //   and date between '2015-1-1' and '2015-1-15'
  //   union
  //   select avg,date,stid from perfect where lat=51.40164 and lng=8.05985
  //   and date between '2015-1-1' and '2015-1-15'
  //   union
  //   select avg,date,stid from perfect where lat=51.4104958 and lng=8.054933
  //   and date between '2015-1-1' and '2015-1-15'
  //   union
  //   select avg,date,stid from perfect where lat=51.4205 and lng=7.9903
  //   and date between '2015-1-1' and '2015-1-15' order by date
  // `

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
      .range([523,1908])
      .domain([new Date().setFullYear(2014,6,8),new Date().setFullYear(2020,10,3)])
    const mouse_on = timescale.invert(event.screenX);
    const year = mouse_on.getFullYear().toString()
    const month = mouse_on.getMonth().toString()
    const day = mouse_on.getDate().toString()
    document.getElementById("dashboard_year").textContent = `Year:${year}`;
    document.getElementById("dashboard_month").textContent = `Month:${month}`;
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

  const introduction = 
  `This is an visualization for fuel price of germany during 2015-2020.\nThe horizon graph shows the overview a the whole dataset.
                The hexbin map and live map show the fuel price of specific date. 
                There goals of this visualization are: 
                1. Show the overview of the trend of the gas price. 
                2. Shows the nearby gas stations of a given coordinate, and help user to find the historically cheapest station. 

                Here are the list of interactions in this visualization: 
                1. Swith the fuel type.
                2. Switch the time`


  return (
    <div class="root">
      <div class="overview_level">
        <div class ="overview_level_child" id="introduction_container">
          <div>
            <p id="introduction">{introduction}</p>
          </div>
          <div class="date_dashboard">
            <div class="one"><p>This dash board displace the which date's data 
              are used for the day level visualization in the hexbinned map. 
              Click the horizon graph to select which day to visualize</p></div>
            <div class="dashboard_item" id="dashboard_year">Year:2018</div>
            <div class="dashboard_item" id="dashboard_month">Month:11</div>
            <div class="dashboard_item" id="dashboard_day">Day:2</div>
          </div>
        </div>
        <div> 
          <div class ="overview_level_child" id="horizon_container"></div>
          {/* <div id="horizon_legend">horizon_legend</div> */}
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
