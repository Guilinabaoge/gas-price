import * as mapboxgl from 'mapbox-gl';
export function map_live(){

    const map = document.getElementById("map_container")
    mapboxgl.accessToken =  'pk.eyJ1IjoiZ3VpbGluYWJhb2dlIiwiYSI6ImNsYWt3czRuMzAwMGczb2t2a3J4azRweHgifQ.OgCn9ii9a9NDSjOg1Rqy_g';
    const map_live = new mapboxgl.Map({
    container: 'map_container', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    // TODO use the local css instead
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [10.404954,50.520008], // starting position [lng, lat]
    zoom: 6, // starting zoom
    projection: 'mercator', // display the map as a 3D globe
    scrollZoom: false
    });
    
    map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
    });
  };