import React, { StrictMode,useState, useCallback, useEffect } from 'react';
import { createRoot } from "react-dom/client";
import { interpolateYlOrRd, scaleSequential, min,max,select,format,range,scaleQuantize,interpolateBlues} from 'd3';
import { legendColor } from 'd3-svg-legend'
import { useMap } from './useMap';
import { Marks } from './Marks';
import { useGas } from './useGas'; 


// const width = 3072;
// const height = 1920;

const width = 960;
const height = 500;


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

  var svg = select("#colorbar");


  svg.append("g")
      .attr("class", "legendQuant")
      .attr("transform", "translate(520,70) scale(1)");
  
  var legend = legendColor()
      .labelFormat(format(".3f"))
      .cells(10)
      .shape("rect")
      .titleWidth(10)
      .shapeHeight(15)
      .shapeWidth(15)
      .scale(colorScale);
  
  svg.select(".legendQuant")
      .call(legend);

  
  return (
    <svg viewBox="0 0 2000 1500">
      <svg viewBox="500 0 800 1500" id="colorbar">
        <g transform = "translate(-1050,-650) scale(4)">
            <Marks
              map={map} 
              rowByState={rowByState}
              colorScale = {colorScale}
              colorValue = {colorValue}
            />
        </g>
      </svg>
      <rect x="0" y="0" width="2000" height="60" fill="blue"></rect>
      <text x="1000" y="40" fontFamily="Verdana" fontSize="35" fill="yellow" textAnchor="middle">Germany gas price visualization</text>
      <line x1="600" y1="1000" x2="600" y2="60" stroke="black" />
      <line x1="1350" y1="1000" x2="1350" y2="60" stroke="black" />
      <rect x="1050" y="70" width="200" height="100" fill="none" stroke="black" rx="15" ></rect>
      <text x="1150" y="130" fontFamily="Verdana" fontSize="35" fill="yellow" textAnchor="middle" id="statename">State</text>
    </svg>
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
