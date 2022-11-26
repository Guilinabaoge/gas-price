import {select,selectAll,pointer,scaleTime} from "d3";

export function eventHandlers(){
    select("#time").on("input",make_graph);
    selectAll(".hex").on("click",clickHex);
  
    select("#horizon_graph").on("mousemove",(event)=>{
      var mouse = pointer(event)
      select(".mouse-line").attr("d",`M ${mouse[0]},500 ${mouse[0]},0`)
      updateTooltipContent(event)
    });
  
    select("#horizon_graph").on("mouseover",(event)=>{
      select(".mouse-line").style("opacity", "1")
      select("#tooltip").style("opacity", "1")
    });
  
    select("#horizon_graph").on("mouseout",(event)=>{
      select(".mouse-line").style("opacity", "0")
      select("#tooltip").style("opacity", "0")
    });
}


function updateTooltipContent(event){
  const mouse_on = timescale.invert(event.screenX);
  const year = mouse_on.getFullYear().toString()
  const month = mouse_on.getMonth().toString()
  const day = mouse_on.getDate().toString()
    select("#tooltip").html(`Year:${year}   Month:${month}   Day:${day}`)
    .style('display', 'block')
    .style('left', `${event.screenX-200}px`)
    .style('top', `${event.screenY-180}px`)
    .style('font-size', 11.5)

  
  }

// var dateObj = new Date();
// dateObj.setFullYear(2015,1,1);
const timescale = scaleTime()
  .range([523,1908])
  .domain([new Date().setFullYear(2014,6,8),new Date().setFullYear(2020,10,3)])
//TODO
function clickHex(){
    console.log("Hi")
}


//TODO scroll bar
function make_graph(){
    update_slider(+document.getElementById("time").value)
}


//TODO change the slider domain to 2015-01-01 --> 2020-01-01
function update_slider(time) {
    var dateObj = new Date();
    dateObj.setFullYear(2015,1,1);
    dateObj.setDate(dateObj.getDate()+time)
    const year = dateObj.getFullYear().toString()
    const mont = dateObj.getMonth().toString()
    const day = dateObj.getDate().toString()
    select("#prettyTime")
    .text(`${day}   ${mont}   ${year}`);
}



export function makeVerticalLine(){
    const horizonGraph = select("#horizon_graph");
    const mouseG = horizonGraph.append("g").attr("class", "mouse-over-effects");

    mouseG.append("path") // create vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1")
    .style("opacity", "0")

    select("#horizon_container").append("div")
      .attr('id', 'tooltip')
      .style('position', 'absolute')
      .style("background-color", "#D3D3D3")
      .style('padding', 6)
      .style('display', 'none')
  }