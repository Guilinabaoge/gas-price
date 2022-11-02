export const YearChart = ({
    map,
    rowByState,
    colorScale,
    colorValue
  }) => (
    <g className="marks">
      {map.features.map(feature => {
        const d = rowByState.get(feature.properties.NAME_1)
        return <path fill={colorScale(colorValue(d))} d={path(feature)} onMouseOver={()=>setState(feature.properties.NAME_1)}/> 
      })}
      
    </g>
  );