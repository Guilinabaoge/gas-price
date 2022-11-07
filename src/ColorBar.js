import { select,format} from 'd3';
import { legendColor } from 'd3-svg-legend'


export const ColorBar = (colorScale) => {
  // document.getElementById('colorbar')
  var svg = select("#colorbar");
  svg.append("g")
  .attr("class", "legendQuant")
  .attr("transform", "translate(100,70) scale(1)");

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
  
  
};