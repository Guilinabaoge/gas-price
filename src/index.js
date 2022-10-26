import React, { StrictMode,useState, useCallback, useEffect } from 'react';
import { createRoot } from "react-dom/client";
import { interpolateYlOrRd, scaleSequential, min,max,select,format,range,scaleQuantize} from 'd3';
import { legendColor } from 'd3-svg-legend'
import { useMap } from './useMap';
import { Marks } from './Marks';
import { useGas } from './useGas'; 
import { ColorBar } from './ColorBar';



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

  
  const colorScale = scaleSequential(interpolateYlOrRd)
		.domain([min(gas,colorValue),max(gas,colorValue)]);

 
  console.log(typeof colorScale);
  var svg = select("#colorbar");

  svg.append("g")
      .attr("class", "legendQuant")
      .attr("transform", "translate(390,210) scale(0.5)");
  
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
    <svg width={width} height={height}>
      <svg viewBox="400 200 400 300"
        >
          <Marks
            map={map} 
            rowByState={rowByState}
            colorScale = {colorScale}
            colorValue = {colorValue}
          />
      </svg>
      <svg viewBox="480 200 200 200" id="colorbar">
      
      </svg> 
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
