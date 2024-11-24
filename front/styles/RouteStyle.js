import { Stroke, Style } from 'ol/style';

export class RouteStyle extends Style {
    constructor() {
        super({
            stroke: new Stroke({
                color: 'red',
                width: 3,
            }),
        });
    }
}