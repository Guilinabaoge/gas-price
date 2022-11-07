import { geoMercator, geoPath,select,interpolateReds,sum,max } from 'd3';
import './styles.css'
import React from 'react';
import {hexbin} from 'd3-hexbin';
import {useHex} from './useHex'

const w = 960;

const width = 3072;
const height = 1920;

 
export const projection = geoMercator()
	.center([10.40, 53.31])
  .scale([w]);
const path = geoPath(projection);


// function setState(state){
//   document.getElementById('statename').textContent = state;
// }

export const hex = (city_info)=>{
  var _hexbin = hexbin()
  .extent([[0, 0], [640, 800]])
  .x(x => x.x)
  .y(y => y.y)
  .radius(800 / 300);
 

  
  const city_info_hex = _hexbin(city_info)
  // const hex_max = max(city_info_hex.map(o => sum(o.map(d => d.diesel))))
  const hex_max = 300000

  console.log(city_info_hex)
  console.log(select("#colorbar").append("g").selectAll("path"))
  var map = select("#colorbar");
  map
  .append("g")
  .selectAll("path")
  .data(city_info_hex)
  .join("path")
  .attr('class', 'hex')
  .attr("transform", d => `translate(${d.x}, ${d.y})`)
  .attr("transform", "translate(700,70) scale(6)")
  .attr("d", _hexbin.hexagon())
  .style("fill", o =>
    interpolateReds((sum(o.map(d => d.diesel)) / hex_max) ** 0.25)
  )


}
  




export const Marks = ({
  map,
  rowByState,
  colorScale,
  colorValue
}) => (
  <g className="marks">
    {map.features.map(feature => {
      const d = rowByState.get(feature.properties.NAME_1)
      // console.log(projection([43.71035,-75.40213]))
      return <path transform = "translate(-1150,-610) scale(3.4)" fill="white" stroke="black"  stroke-width="0.3" d={path(feature)}/> 
      // onMouseOver={()=>setState(feature.properties.NAME_1)}
    })}
  </g>
);


