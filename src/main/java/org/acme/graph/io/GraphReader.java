package org.acme.graph.io;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import org.acme.graph.model.Edge;
import org.acme.graph.model.Graph;
import org.acme.graph.model.Vertex;
import org.geotools.api.data.DataStore;
import org.geotools.api.data.DataStoreFinder;
import org.geotools.api.data.FeatureSource;
import org.geotools.api.feature.simple.SimpleFeature;
import org.geotools.api.feature.simple.SimpleFeatureType;
import org.geotools.api.filter.Filter;
import org.geotools.feature.FeatureCollection;
import org.geotools.feature.FeatureIterator;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.MultiLineString;

/**
 * Lecture d'un fichier d'arc correspondant au modèle ROUTE500 de l'IGN
 * 
 * @author MBorne
 *
 */
public class GraphReader {

	private static final String DOUBLE_SENS = "Double sens";
	private static final String SENS_DIRECT = "Sens direct";
	private static final String SENS_INVERSE = "Sens inverse";

	/**
	 * Lecture du fichier shapefile
	 * 
	 * @param file
	 * @return
	 */
	public Graph read(File file) throws Exception {
		Graph graph = new Graph();

		Map<String, Object> map = new HashMap<>();
		map.put("url", file.toURI().toURL());

		DataStore dataStore = null;
		FeatureIterator<SimpleFeature> features = null;
		try {
			dataStore = DataStoreFinder.getDataStore(map);
			String typeName = dataStore.getTypeNames()[0];
			FeatureSource<SimpleFeatureType, SimpleFeature> dataSource = dataStore.getFeatureSource(typeName);
			FeatureCollection<SimpleFeatureType, SimpleFeature> collection = dataSource.getFeatures(Filter.INCLUDE);

			features = collection.features();
			while (features.hasNext()) {
				SimpleFeature feature = features.next();
				createEdges(graph, feature);
			}
		} finally {
			if (features != null) {
				features.close();
			}
			if (dataStore != null) {
				dataStore.dispose();
			}
		}

		return graph;
	}

	/**
	 * Création des arcs direct et inverse pour une feature correspondant à un
	 * tronçon de route.
	 * 
	 * @param graph
	 * @param feature
	 */
	public void createEdges(Graph graph, SimpleFeature feature) {
		String id = feature.getID();

		/* Récupération de la géométrie dans le sens direct */
		LineString geometry = toLineString(feature);

		/* Création ou récupération des sommets initiaux et finaux */
		Vertex source = graph.getOrCreateVertex(geometry.getStartPoint().getCoordinate());
		Vertex target = graph.getOrCreateVertex(geometry.getEndPoint().getCoordinate());

		/* Récupération du sens de circulation */
		String sens = (String) feature.getAttribute("SENS");

		/* Création de l'arc pour le parcours en sens direct */
		if (sens.equals(DOUBLE_SENS) || sens.equals(SENS_DIRECT)) {
			Edge directEdge = new Edge();
			directEdge.setId(id + "-direct");
			directEdge.setSource(source);
			directEdge.setTarget(target);
			graph.getEdges().add(directEdge);
		}
		if (sens.equals(DOUBLE_SENS) || sens.equals(SENS_INVERSE)) {
			/* Création de l'arc pour le parcours en sens opposé */
			Edge reverseEdge = new Edge();
			reverseEdge.setId(id + "-reverse");
			reverseEdge.setSource(target);
			reverseEdge.setTarget(source);
			graph.getEdges().add(reverseEdge);
		}
	}

	/**
	 * Récupération de la géométrie de l'arc à partir de la feature
	 * 
	 * @param feature
	 * @return
	 */
	private static LineString toLineString(SimpleFeature feature) {
		Geometry geometry = (Geometry) feature.getDefaultGeometryProperty().getValue();
		if (geometry instanceof LineString) {
			return (LineString) geometry;
		} else if (geometry instanceof MultiLineString) {
			MultiLineString mls = (MultiLineString) geometry;
			return (LineString) mls.getGeometryN(0);
		} else {
			throw new RuntimeException("Unsupported geometry type : " + geometry.getGeometryType());
		}
	}
}
