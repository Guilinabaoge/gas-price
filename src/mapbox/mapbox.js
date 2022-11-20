import * as mapboxgl from 'mapbox-gl';
import './mapbox-gl.css';

var map = null

var marker = new mapboxgl.Marker();

function addMarker(event){
  var coordinates = event.lngLat;
  console.log('Lng:', coordinates.lng, 'Lat:', coordinates.lat);
  marker.setLngLat(coordinates).addTo(map);
}

export function map_live(gas_stations){

    // const map = document.getElementById("map_container")
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
 

    // map.on('style.load', () => {
    // map.setFog({}); // Set the default atmosphere style
    // });
    
  };

