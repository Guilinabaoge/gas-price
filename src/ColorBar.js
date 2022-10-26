import { interpolateYlOrRd, scaleSequential, max,select,scaleQuantize,range,format,create} from 'd3';
import { legendColor } from 'd3-svg-legend'


export const ColorBar = (colorScale) => {
    // var svg = select("#colorbar");

    // svg.append("g")
    //     .attr("class", "legendQuant")
    //     .attr("transform", "translate(20,20");

    // var legend = legendColor()
    //     .labelFormat(format(".2f"))
    //     .useClass(true)
    //     .title("title")
    //     .titleWidth(100)
    //     .scale(colorScale);

    // svg.select(".legendQuant")
    //     .call(legend);

    return (<g fill="red" stroke="green" stroke-width="1">
    <circle cx="400" cy="200" r="2" />
  </g>);

};