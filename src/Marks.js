import { geoMercator, geoPath } from 'd3';

const w = 960;
const h = 100;
 
const projection = geoMercator()
	.center([10.40, 53.31])
  .scale([w]);
const path = geoPath(projection);

export const Marks = ({
  map,
  rowByState,
  colorScale,
  colorValue
}) => (
  <g className="marks">
    {map.features.map(feature => {
      const d = rowByState.get(feature.properties.NAME_1)
      // console.log(d)
      // console.log(colorValue(d))
      // console.log(colorScale(colorValue(d)))
      return <path fill={colorScale(colorValue(d))} d={path(feature)}/> 
    })}
    
  </g>
);
