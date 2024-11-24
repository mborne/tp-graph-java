package org.acme.graph.controllers;

import java.util.Collection;

import org.acme.graph.model.Graph;
import org.acme.graph.model.Vertex;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GraphController {
	
	@Autowired
	private Graph graph;

	@GetMapping(value = "/api/vertices")
	public Collection<Vertex> getVertices() {
		return graph.getVertices();
	}

}

