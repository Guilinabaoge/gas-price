import React, { StrictMode,useState, useCallback, useEffect } from 'react';
import { createRoot } from "react-dom/client";
import { interpolateYlOrRd, scaleSequential, min,max,select,format,interpolateBlues,scaleBand,scaleLinear} from 'd3';
import { legendColor } from 'd3-svg-legend';
import { useMap } from './useMap';
import { Marks } from './Marks';
import { useGas } from './useGas'; 
import { ColorBar } from './ColorBar'
import { HorizonChart } from './HorizonChart';

var margin = {top: 20, right: 20, bottom: 100, left: 60};
const width = 3072;
const height = 1920;

// const width = 2960;
// const height = 2500;


const App = () => {
  const map = useMap();
  const gas = useGas(); 



  if (!map|| !gas) {
    return <pre>Loading...</pre>;
  }
  
  const rowByState = new Map();
  gas.forEach(d => {
  	rowByState.set(d.state,d);
  })
  
  const colorValue = d => d.diesel;

  
  const colorScale = scaleSequential(interpolateBlues)
		.domain([min(gas,colorValue),max(gas,colorValue)]);

  ColorBar(colorScale);
  HorizonChart();

  
  return (
    <body width={width} height={height} > 
      <div id="hbar" ></div>
      <svg width={width} height={height} id="colorbar">
          <g transform = "translate(-1000,-500) scale(3)" >
              <Marks
                map={map} 
                rowByState={rowByState}
                colorScale = {colorScale}
                colorValue = {colorValue}
              />
          </g>
      
        {/* <rect x="0" y="0" width="2000" height="60" fill="blue"></rect>
        <text x="1000" y="40" fontFamily="Verdana" fontSize="35" fill="yellow" textAnchor="middle">Germany gas price visualization</text>
        <line x1="600" y1="1000" x2="600" y2="60" stroke="black" />
        <line x1="1350" y1="1000" x2="1350" y2="60" stroke="black" />
        <rect x="1050" y="70" width="220" height="100" fill="none" stroke="black" rx="15" ></rect>
        <text x="1150" y="130" fontFamily="Verdana" fontSize="15" fill="black" textAnchor="middle" id="statename">State</text> */}
      </svg>
    </body>
  );
};


// const rootElement = document.getElementById('root');
// ReactDOM.render(<App />, rootElement);

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
