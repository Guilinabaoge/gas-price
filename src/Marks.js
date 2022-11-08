import { geoMercator, geoPath,select,interpolateReds,sum,max,json } from 'd3';
import './styles.css'
import React from 'react';
import {hexbin} from 'd3-hexbin';
import { useMap } from './useMap';
const w = 960;

const width = 3072;
const height = 1920;


// const map = useMap();

// export const projection = geoMercator()
//   .reflectY(true)
//   // .fitSize([width, height], states)

// 	// .center([10.40, 53.31])
//   // .scale([height]);
// const path = geoPath(projection);


// function setState(state){
//   document.getElementById('statename').textContent = state;
// }

export const hex = (map,city_info)=>{
  var _hexbin = hexbin()
  .extent([[0, 0], [width, height]])
  .x(x => x.x)
  .y(y => y.y)
  .radius(width / width);
 
  const city_info_hex = _hexbin(city_info)

  const hex_max = max(city_info_hex.map(o => sum(o.map(d => d.diesel))))
  // const hex_max = 300000

  // var map = select("#colorbar").select('#map_container').select("g.marks");
  var map = select("#colorbar");
  map
  .append("g")
  .selectAll("path")
  .data(city_info_hex)
  .join("path")
  .attr('class', 'hex')
  // .attr("transform", d => `translate(${d.x-1350}, ${d.y-1700})`)
  .attr("transform", d => `translate(${d.x}, ${d.y})`)
  // .attr("transform", "translate(-1150,-610) scale(6)")
  .attr("d", _hexbin.hexagon())
  .style("fill", o =>
    interpolateReds((sum(o.map(d => d.diesel)) / hex_max) ** 0.25)
  )
  // console.log(select("#colorbar").selectAll("path"))

}
  




export const Marks = ({
  map,
  rowByState,
  path,
  colorScale,
  colorValue
}) => (
  <g className="marks">
    {map.features.map(feature => {
      const d = rowByState.get(feature.properties.NAME_1)
      return <path fill="white" stroke="black"  stroke-width="0.3" d={path(feature)}/> 
      // transform = "translate(-1150,-610) scale(3.4)"
      // onMouseOver={()=>setState(feature.properties.NAME_1)}
    })}
  </g>
);


