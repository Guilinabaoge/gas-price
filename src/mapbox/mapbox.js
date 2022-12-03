import * as mapboxgl from 'mapbox-gl';
import './mapbox-gl.css';
import { makeNewLineChart } from '../multiLineChart/lineChart';

var map = null;
var _gas_stations = null;
var marker1 = new mapboxgl.Marker({color: 'red'});
const colorlist = ['blue','violet','yellow','green','orange']
const neighbors = new Array(5);
for(let i = 0; i < 5; i++)
{
    neighbors[i] =  new mapboxgl.Marker({color:colorlist[i]})
}

function getCurrentTime(){
  return new Date(2015,1,1)
}

export function addMarker(event){
  var coordinates = event.lngLat;
  marker1.setLngLat(coordinates).addTo(map);
  let topk = pClosest(_gas_stations,5,coordinates)
  const time = getCurrentTime()
  makeNewLineChart(topk,time)
  for(let i = 0; i < 6; i++)
  {
      neighbors[i].setLngLat([topk[i].lng,topk[i].lat]).addTo(map); 
  }
}



export function map_live(gas_stations){
    _gas_stations = gas_stations;
    mapboxgl.accessToken =  'pk.eyJ1IjoiZ3VpbGluYWJhb2dlIiwiYSI6ImNsYWt3czRuMzAwMGczb2t2a3J4azRweHgifQ.OgCn9ii9a9NDSjOg1Rqy_g';
    const map_live = new mapboxgl.Map({
    container: 'map_container', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [10.40,51.520008], // starting position [lng, lat]
    zoom: 5, // starting zoom
    projection: 'mercator', // display the map as a 3D globe
    // scrollZoom: false
    });

    map = map_live
    map.on('click',addMarker)

  };


function pClosest(pts,k,pt)
{
    let n = pts.length;
    let distance = new Array(n);
    let result = new Array(k); 
    for(let i = 0; i < n; i++)
    {
        let lat = Number(pts[i].lat), lng = Number(pts[i].lng);
        distance[i] = (lat - Number(pt.lat))**2 + (lng - Number(pt.lng))**2;
    }
  
    distance.sort(function(a,b){return a-b;});
      
    // Find the k-th distance
    let distk = distance[k - 1];
    
    // Print all distances which are
    // smaller than k-th distance
    let counter = 0;
    for(let i = 0; i < n; i++)
    {
        let lat = Number(pts[i].lat), lng = Number(pts[i].lng);
        let dist = (lat - Number(pt.lat))**2 + (lng - Number(pt.lng))**2;
          
        if (dist <= distk){
          result[counter] = {lat,lng};
          counter += 1;
        }  
    }
    return result
}
