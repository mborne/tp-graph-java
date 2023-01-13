package org.acme.graph.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.locationtech.jts.geom.Coordinate;

import java.util.ArrayList;
import java.util.List;

/**
 * 
 * Un sommet dans un graphe
 * 
 * @author MBorne
 *
 */
public class Vertex {

	/**
	 * Identifiant du sommet
	 */
	private String id;

	/**
	 * Position du sommet
	 */
	private Coordinate coordinate;

	/**
	 * dijkstra - coût pour atteindre le sommet
	 */
	private double cost;
	/**
	 * dijkstra - arc entrant avec le meilleur coût
	 */
	private Edge reachingEdge;
	/**
	 * dijkstra - indique si le sommet est visité
	 */
	private boolean visited;

	/**
	 * Liste des Edges qui visent ce vertice
	 */
	private List<Edge> inEdge = new ArrayList<>();

	/**
	 * Liste des Edges qui partent de ce vertice
	 */
	private List<Edge> outEdge = new ArrayList<>();

	Vertex() {

	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Coordinate getCoordinate() {
		return coordinate;
	}

	public void setCoordinate(Coordinate coordinate) {
		this.coordinate = coordinate;
	}

	@JsonIgnore
	public double getCost() {
		return cost;
	}

	public void setCost(double cost) {
		this.cost = cost;
	}

	@JsonIgnore
	public Edge getReachingEdge() {
		return reachingEdge;
	}

	public void setReachingEdge(Edge reachingEdge) {
		this.reachingEdge = reachingEdge;
	}

	public boolean isVisited() {
		return visited;
	}

	public void setVisited(boolean visited) {
		this.visited = visited;
	}

	public List<Edge> getInEdge() {
		return inEdge;
	}

	public List<Edge> getOutEdge() {
		return outEdge;
	}

	@Override
	public String toString() {
		return id;
	}

}
