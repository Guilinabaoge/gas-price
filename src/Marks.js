import { geoMercator, geoPath,select } from 'd3';
import './styles.css'
import React from 'react';

const w = 960;
const h = 100;
 
const projection = geoMercator()
	.center([10.40, 53.31])
  .scale([w]);
const path = geoPath(projection);

// function sayHi(){
//   console.log('hi')
// }

function setState(state){
  document.getElementById('statename').textContent = state;
  // console.log(name.textContent)
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
      return <path fill={colorScale(colorValue(d))} d={path(feature)} onClick={()=>setState(feature.properties.NAME_1)}/> 
    })}
    
  </g>
);
