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
    descending
  } from 'd3';
import { nest } from 'd3-collection'
import { colorLegend } from './colorLegend';
import './styles.css';

  
  // const width = +svg.attr('width');
  // const height = +svg.attr('height');
  
  function render(data){
    const width = 500;  
    const height = 100;
    const svg = select('#line_chart');
    const title = 'Fuel price change of 5 closest stations';
    
    const xValue = d => d.timestamp;
    const xAxisLabel = 'Time';
    
    const yValue = d => d.temperature;
    const circleRadius = 6;
    const yAxisLabel = 'Price';
    
    const colorValue = d => d.city;
    
    const margin = { top: 25, right: 20, bottom: 0, left:100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    // const innerWidth = width 
    // const innerHeight = height 
    
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
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    
    const xAxis = axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickPadding(4);
    
    const yAxis = axisLeft(yScale)
      .tickSize(-innerWidth/2)
      .tickPadding(4);
    
    const yAxisG = g.append('g').call(yAxis);
    yAxisG.selectAll('.domain').remove();
    
    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -20)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);
    
    const xAxisG = g.append('g').call(xAxis)
      .attr('transform', `translate(0,${innerHeight})`);
    
    xAxisG.select('.domain').remove();
    
    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 25)
        .attr('x', 90)
        .attr('fill', 'black')
        .text(xAxisLabel);
    
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
        .attr('stroke', d => colorScale(d.key));
    
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
  
export function makeLineChart(){
    csv('https://gist.githubusercontent.com/Guilinabaoge/1ad61547838756a18904c6c72dde86b0/raw/f69240c0aa08d4d5275b190a1900319c080618e4/linegraph.csv')
    .then(data => {
      data.forEach(d => {
        d.temperature = +d.temperature;
        d.timestamp = new Date(d.timestamp);
      });
      render(data);
      console.log(data)
    });
}  
  

