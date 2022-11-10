import { geoMercator, geoPath,select,interpolateReds,sum,max,json,interpolateBuGn } from 'd3';
import './styles.css'
import React from 'react';
import {hexbin} from 'd3-hexbin';
import { useMap } from './useMap';

export const hex = (width,height,map,city_info)=>{
  var _hexbin = hexbin()
  .extent([[0, 0], [width, height]])
  .x(x => x.x)
  .y(y => y.y)
  .radius(10);
 
  const city_info_hex = _hexbin(city_info)

  const hex_max = max(city_info_hex.map(o => sum(o.map(d => d.diesel))))

  var map = select("#colorbar").select("#map_container");
  map
  .append("g")
  .selectAll("path")
  .data(city_info_hex)
  .join("path")
  .attr('class', 'hex')
  .attr("transform", d => `translate(${d.x-2000}, ${d.y-2400})`)
  .attr("d", _hexbin.hexagon())
  .style("fill", o =>
    interpolateBuGn((sum(o.map(d => d.diesel)) / hex_max) ** 0.25)
  )
  .style("opacity", 0.6)

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
      return <path fill="white" stroke="black" transform = "scale(0.9)" stroke-width="0.3" d={path(feature)}/> 
      // transform = "translate(-1150,-610) scale(3.4)"
      // onMouseOver={()=>setState(feature.properties.NAME_1)}
    })}
  </g>
);


