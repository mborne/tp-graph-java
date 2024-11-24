package org.acme.graph.controllers;

import java.util.List;

import org.acme.graph.model.Edge;
import org.acme.graph.model.Graph;
import org.acme.graph.model.Vertex;
import org.acme.graph.routing.DijkstraPathFinder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RoutingController {

	@Autowired
	private Graph graph;

	@GetMapping(value = "/api/route")
	public List<Edge> findPath(
		@RequestParam(value = "origin", required = true)
		String originId,
		@RequestParam(value = "destination", required = true)
		String destinationId
	) {
		DijkstraPathFinder pathFinder = new DijkstraPathFinder(graph);
		Vertex origin = graph.findVertex(originId);
		Vertex destination = graph.findVertex(destinationId);
		return pathFinder.findPath(origin, destination);
	}

}
