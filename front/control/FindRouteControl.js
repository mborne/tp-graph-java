import Control from 'ol/control/Control'

import './FindRouteControl.css'
import VectorSource from 'ol/source/Vector';
import { RouteStyle } from '../styles/RouteStyle';
import GeoJSON from 'ol/format/GeoJSON';
import { MapEvent } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import { logger } from '../logger';


export class FindRouteControl extends Control {

    /**
     * @param {Object} [opt_options] Control options.
     */
    constructor(opt_options) {
        const options = opt_options || {};

        const button = document.createElement('button');
        button.title = "FindRouteControl";
        // see https://viglino.github.io/font-gis/
        button.innerHTML = '<i class="fg-route"></i>';

        const element = document.createElement('div');
        element.className = 'find-route-control ol-unselectable ol-control';
        element.appendChild(button);

        super({
            element: element,
            target: options.target,
        });

        element.addEventListener('click', this.toggleActivation.bind(this), false);

        this.routeVertices = [];
        this.routeLayer = this.createRouteLayer();
    }


    /**
     * Gestion des clics sur la carte pour le contrôle.
     *
     * @param {MapEvent} e 
     * @returns 
     */
    handleClick(e) {
        if (!this.active) {
            return;
        }
        //
        const features = this.getMap().getFeaturesAtPixel(e.pixel, {
            layerFilter: (layer) => {
                return layer.get('name') === 'vertices'
            }
        });

        if (features.length == 0) {
            logger.info('Vertex not found');
            return;
        }

        const vertexId = features[0].get('id');
        logger.info(`clicked on ${vertexId}`);
        this.routeVertices.push(vertexId);
        if (this.routeVertices.length == 2) {
            const origin = this.routeVertices[0];
            const destination = this.routeVertices[1];
            // reset routeVertices
            this.routeVertices.length = 0;

            const routeUrl = `/api/route?origin=${origin}&destination=${destination}`;
            logger.info(`GET ${routeUrl} ...`);
            const routeSource = this.routeLayer.getSource();
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
                .then((featureCollection) => {
                    logger.info(`Route found with ${featureCollection.features.length} edge(s)`);
                    routeSource.clear();
                    routeSource.addFeatures(routeSource.getFormat().readFeatures(featureCollection));
                });
        }
    }



    /**
     * Création d'une couche pour l'affichage du résultat
     */
    createRouteLayer() {
        const routeSource = new VectorSource({
            format: new GeoJSON({
                dataProjection: 'EPSG:2154',
                featureProjection: 'EPSG:3857'
            })
        });
        return new VectorLayer({
            source: routeSource,
            features: [],
            style: new RouteStyle()
        });
    }

    /**
     * @inheritdoc
     */
    setMap(map) {
        super.setMap(map);
        if (!map) {
            return;
        }
        map.addLayer(this.routeLayer);
        map.on('singleclick', this.handleClick.bind(this));
    }

    /**
     * Clic sur le bouton du contrôle
     * @param {object} event
     */
    toggleActivation(event) {
        event.preventDefault();
        this.setActive(!this.active);
    }

    /**
     * Activation et désactivation du contrôle
     * @param {boolean} active
     * @return {this}
     */
    setActive(active) {
        console.log(`FindRouteControl.setActive(${active})`);
        this.active = active;
        if (this.active) {
            logger.info(`click origin and destination to find a route...`);
            this.element.classList.add('ol-active');
        } else {
            logger.clear();
            this.element.classList.remove('ol-active');
            if (this.routeLayer) {
                this.routeLayer.getSource().clear();
            }
        }
        return this;
    }

}



