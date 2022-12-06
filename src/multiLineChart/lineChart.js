import {
    select,
    csv,
    scaleLinear,
    scaleTime,
    scaleOrdinal,
    extent,
    axisLeft,
    axisBottom,
    line,
    curveBasis,
    schemeCategory10,
    descending,
    create
  } from 'd3';
import { nest } from 'd3-collection'
import './styles.css';

  function render(data){
    const width = 500;  
    const height = 100;


    const svg = create("svg")
      .attr("id","line_chart")
      .attr("class","plot_item")
      .attr("width", "600px")
      .attr("height", "300px")
      .attr("transform","translate(300,350) scale(2.9)")

    document.getElementById("plot_container").appendChild(svg.node())
      

    const title = 'Diesel price change of 5 closest stations';
    
    const xValue = d => d.timestamp;
    const xAxisLabel = 'Time';
    
    const yValue = d => d.temperature;
    const circleRadius = 6;
    const yAxisLabel = 'Price';
    
    const colorValue = d => d.city;
    
    const margin = { top: 25, right: 20, bottom: 0, left:100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
   
    
    const xScale = scaleTime()
      .domain(extent(data, xValue))
      .range([0, innerWidth/2])
      .nice();
    
    const yScale = scaleLinear()
      .domain(extent(data, yValue))
      .range([innerHeight, 0])
      .nice();
    
    const colorScale = scaleOrdinal(schemeCategory10);
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left+15},${margin.top})`);
    
    
    const xAxis = axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickPadding(4);
    
    const yAxis = axisLeft(yScale)
      .tickSize(-innerWidth/2)
      .tickPadding(4);
    
    const yAxisG = g.append('g').call(yAxis);
    yAxisG.selectAll('.domain').remove();
    
    // yAxisG.append('text')
    //     .attr('class', 'axis-label')
    //     .attr('y', -30)
    //     .attr('x', -innerHeight / 2)
    //     .attr('fill', 'black')
    //     .attr('transform', `rotate(-90)`)
    //     .attr('text-anchor', 'middle')
    //     .text(yAxisLabel);
    
    const xAxisG = g.append('g').call(xAxis)
      .attr('transform', `translate(0,${innerHeight})`);
    
    xAxisG.select('.domain').remove();
    
    // xAxisG.append('text')
    //     .attr('class', 'axis-label')
    //     .attr('y', 25)
    //     .attr('x', 90)
    //     .attr('fill', 'black')
    //     .text(xAxisLabel);
    
    const lineGenerator = line()
      .x(d => xScale(xValue(d)))
      .y(d => yScale(yValue(d)))
      .curve(curveBasis);
    
    const lastYValue = d =>
      yValue(d.values[d.values.length - 1]);
    
    const nested = nest()
      .key(colorValue)
      .entries(data)
      .sort((a, b) =>
        descending(lastYValue(a), lastYValue(b))
      );
    
    colorScale.domain(nested.map(d => d.key));

    
    
    g.selectAll('.line-path').data(nested)
      .enter().append('path')
        .attr('class', 'line-path')
        .attr('d', d => lineGenerator(d.values))
        .attr('stroke', d => d.values[0].color);
        // .attr('stroke', d => colorScale(d.key));
    
    g.append('text')
        .attr('class', 'title')
        .attr('y', -10)
        .text(title);
    
    // svg.append('g')
    //   .attr('transform', `translate(280,50)`)
    //   .call(colorLegend, {
    //     colorScale,
    //     circleRadius: 6,
    //     spacing: 15,
    //     textOffset: 15
    //   });
  };
  
export function makeLineChart(query){
    csv(`http://127.0.0.1:5000/linechart/${query}`)
    .then(data => {
      data.forEach(d => {
        d.temperature = +d.temperature;
        d.timestamp = new Date(d.timestamp);
      });
      render(data);
      console.log(data)
    });
}  

export function makeNewLineChart(topk,time){
  console.log(time)
  var start = time 
  var end = new Date(time.getFullYear(),time.getMonth(),time.getDate())
  end.setDate(time.getDate() + 14)

  var start_string = `${start.getFullYear().toString()}-${start.getMonth().toString()}-${start.getDate().toString()}`;
  var end_string = `${end.getFullYear().toString()}-${end.getMonth().toString()}-${end.getDate().toString()}`;
  
  
  const query = 
  `
  select p.avg,p.date,p.stid,c.color from perfect as p, color as c 
  where p.lat=${topk[0].lat} and p.lng=${topk[0].lng} and c.color_id = 1 
  and p.date between '${start_string}' and '${end_string}'
  union 
  select p.avg,p.date,p.stid,c.color from perfect as p, color as c 
  where p.lat=${topk[1].lat} and p.lng=${topk[1].lng} and c.color_id = 2 
  and p.date between '${start_string}' and '${end_string}'
  union
  select p.avg,p.date,p.stid,c.color from perfect as p, color as c 
  where p.lat=${topk[2].lat} and p.lng=${topk[2].lng} and c.color_id = 3
  and p.date between '${start_string}' and '${end_string}'
  union
  select p.avg,p.date,p.stid,c.color from perfect as p, color as c 
  where p.lat=${topk[3].lat} and p.lng=${topk[3].lng} and c.color_id = 4
  and p.date between '${start_string}' and '${end_string}'
  union
  select p.avg,p.date,p.stid,c.color from perfect as p, color as c 
  where p.lat=${topk[4].lat} and p.lng=${topk[4].lng} and c.color_id = 5
  and p.date between '${start_string}' and '${end_string}' order by date
  `

  select("#line_chart").remove()
  makeLineChart(query)
}
  

