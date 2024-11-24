import './style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';

import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import { RouteStyle } from './styles/RouteStyle';
import { VertexStyle } from './styles/VertexStyle';

/*
 * Add support for Lambert 93 (EPSG:2154)
 */
proj4.defs("EPSG:2154","+proj=lcc +lat_0=46.5 +lon_0=3 +lat_1=49 +lat_2=44 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
register(proj4);

/*
 * Création d'une couche pour l'affichage des sommets
 * (le tableau d'objet JSON est converti en FeatureCollection GeoJSON)
 */
const verticesSource = new VectorSource({
  format: new GeoJSON({
    dataProjection: 'EPSG:2154',
    featureProjection: 'EPSG:3857'
  }),
  style: new VertexStyle(),
  loader: function (extent, resolution, projection, success, failure) {
    fetch('/api/vertices')
      .then((res) => res.json())
      .then((vertices) => {
        const features = vertices.map((vertex) => {
          return {
            type: 'Feature',
            properties: {
              id: vertex.id
            },
            geometry: vertex.geometry
          }
        });
        return {
          type: 'FeatureCollection',
          features: features
        }
      })
      .then((featureCollection) => {
        const features = verticesSource.getFormat().readFeatures(featureCollection);
        verticesSource.addFeatures(features);
        success(features);
      })
      .catch((err)=>{
        console.error(err);
        failure();
      });
  }
});

const verticesLayer = new VectorLayer({
  source: verticesSource
})

/**
 * Création d'une couche pour l'affichage du résultat
 */
const routeSource = new VectorSource({
  format: new GeoJSON({
    dataProjection: 'EPSG:2154',
    featureProjection: 'EPSG:3857'
  })
});
const routeLayer = new VectorLayer({
  source: routeSource,
  features: [],
  style: new RouteStyle()
});


/*
 * Création d'une carte OpenLayers
 */
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    verticesLayer,
    routeLayer
  ],
  view: new View({
    center: fromLonLat([2.0, 47.0]),
    zoom: 5
  })
});

/*
 * Zoom automatique sur la couche des sommets au chargement
 */
verticesLayer.getSource().on("featuresloadend", function () {
  const bboxFeatures = verticesLayer.getSource().getExtent();
  if ( ! bboxFeatures ){
      return;
  }
  map.getView().fit(bboxFeatures);
});


/**
 * Gestion des clics sur la couche des sommets pour calcul
 * du plus court chemin
 */
const routeVertices = [];
map.on('singleclick', function (e) {
  const features = map.getFeaturesAtPixel(e.pixel,{
    layerFilter: (layer) => {
      return layer === verticesLayer
    }
  });
  if ( features.length == 0 ){
    console.log('no vertex at location');
    return;
  }
  // keep first
  const vertexId = features[0].get('id');
  console.log(`clicked on ${vertexId}`);
  routeVertices.push(vertexId);
  if ( routeVertices.length == 2 ){
    const origin = routeVertices[0];
    const destination = routeVertices[1];
    // reset routeVertices
    routeVertices.length = 0;

    const routeUrl = `/api/route?origin=${origin}&destination=${destination}`;
    console.log(`GET ${routeUrl} ...`);
    fetch(routeUrl)
      .then((res) => res.json())
      .then((edges) => {
        console.log(edges);
        const features = edges.map((edge) => {
          return {
            type: 'Feature',
            properties: {
              id: edge.id,
              cost: edge.cost
            },
            geometry: edge.geometry
          }
        });
        return {
          type: 'FeatureCollection',
          features: features
        }
      })
    .then((featureCollection)=>{
      console.log(`found route with ${featureCollection.features.length} edge(s)`);
      routeSource.clear();
      routeSource.addFeatures(routeSource.getFormat().readFeatures(featureCollection));
    });
  }
});

