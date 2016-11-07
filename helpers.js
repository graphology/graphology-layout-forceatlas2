/**
 * Graphology ForceAtlas2 Helpers
 * ===============================
 *
 * Miscellaneous helper functions.
 */

/**
 * Constants.
 */
var PPN = 10,
    PPE = 3;

/**
 * Function generating a flat matrix for both nodes & edges of the given graph.
 *
 * @param  {Graph}  graph - Target graph.
 * @return {object}       - Both matrices.
 */
exports.graphToByteArrays = function(graph) {
  var nodes = graph.nodes(),
      edges = graph.edges(),
      order = nodes.length,
      size = edges.length,
      index = {},
      i,
      j;

  var NodeMatrix = new Float32Array(order * PPN),
      EdgeMatrix = new Float32Array(size * PPE);

  // Iterate through nodes
  for (i = j = 0; i < order; i++) {

    // Node index
    index[nodes[i]] = j;

    // Populating byte array
    NodeMatrix[j] = graph.getNodeAttribute(nodes[i], 'x');
    NodeMatrix[j + 1] = graph.getNodeAttribute(nodes[i], 'y');
    NodeMatrix[j + 2] = 0;
    NodeMatrix[j + 3] = 0;
    NodeMatrix[j + 4] = 0;
    NodeMatrix[j + 5] = 0;
    NodeMatrix[j + 6] = 1 + graph.degree(nodes[i]);
    NodeMatrix[j + 7] = 1;
    NodeMatrix[j + 8] = graph.getNodeAttribute(nodes[i], 'size') || 1;
    NodeMatrix[j + 9] = 0;
    j += PPN;
  }

  // Iterate through edges
  for (i = j = 0; i < size; i++) {

    // Populating byte array
    EdgeMatrix[j] = index[graph.source(edges[i])];
    EdgeMatrix[j + 1] = index[graph.target(edges[i])];
    EdgeMatrix[j + 2] = graph.getEdgeAttribute(edges[i], 'weight') || 0;
    j += PPE;
  }

  return {
    nodes: NodeMatrix,
    edges: EdgeMatrix
  };
};
