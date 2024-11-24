import { Circle, Fill, Stroke, Style } from 'ol/style.js';

const fill = new Fill({
    color: 'rgba(255,255,255,0.4)',
});
const stroke = new Stroke({
    color: '#0000ff',
    width: 1.25,
});

export class VertexStyle extends Style {
    constructor() {
        super({
            image: new Circle({
                fill: fill,
                stroke: stroke,
                radius: 3.0,
            }),
            fill: fill,
            stroke: stroke,
        });
    }
}