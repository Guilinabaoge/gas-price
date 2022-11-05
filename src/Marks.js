import { geoMercator, geoPath,select,zoom } from 'd3';
import './styles.css'
import React from 'react';

const w = 960;

const width = 3072;
const height = 1920;
 
const projection = geoMercator()
	.center([10.40, 53.31])
  .scale([w]);
const path = geoPath(projection);


// function setState(state){
//   document.getElementById('statename').textContent = state;
// }


export const Marks = ({
  map,
  rowByState,
  colorScale,
  colorValue
}) => (
  <g className="marks">
    {map.features.map(feature => {
      const d = rowByState.get(feature.properties.NAME_1)
      return <path transform = "translate(-1150,-610) scale(3.4)"fill={colorScale(colorValue(d))} d={path(feature)}/> 
      // onMouseOver={()=>setState(feature.properties.NAME_1)}
    })}
    
  </g>
);



     {/* <rect x="0" y="0" width="2000" height="60" fill="blue"></rect>
          <text x="1000" y="40" fontFamily="Verdana" fontSize="35" fill="yellow" textAnchor="middle">Germany gas price visualization</text>
          <line x1="600" y1="1000" x2="600" y2="60" stroke="black" />
          <line x1="1350" y1="1000" x2="1350" y2="60" stroke="black" />
          <rect x="1050" y="70" width="220" height="100" fill="none" stroke="black" rx="15" ></rect>
          <text x="1150" y="130" fontFamily="Verdana" fontSize="15" fill="black" textAnchor="middle" id="statename">State</text> */}