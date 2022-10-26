import React, { useState, useEffect } from 'react';
import { json } from 'd3';
import {feature} from 'topojson';

const jsonUrl =
  'https://gist.githubusercontent.com/Guilinabaoge/87d6607c670e0b5c5f5006400ba945d7/raw/2ff86a968311d235be8d14c119af221a700d7977/germany-regions.json';

export const useMap = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    json(jsonUrl).then(topojsonData=>{
    const {DEU_adm2} = topojsonData.objects;
    	setData(feature(topojsonData,DEU_adm2))});
  }, []);
  
  return data;
};