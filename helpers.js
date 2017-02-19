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
 * Very simple Object.assign-like function.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
exports.assign = function(target) {
  target = target || {};

  var objects = Array.prototype.slice.call(arguments).slice(1),
      i,
      k,
      l;

  for (i = 0, l = objects.length; i < l; i++) {
    if (!objects[i])
      continue;

    for (k in objects[i])
      target[k] = objects[i][k];
  }

  return target;
};

/**
 * Function used to validate the given settings.
 *
 * @param  {object}      settings - Settings to validate.
 * @return {object|null}
 */
exports.validateSettings = function(settings) {

  if ('linLogMode' in settings &&
      typeof settings.linLogMode !== 'boolean')
    return {message: 'the `linLogMode` setting should be a boolean.'};

  if ('outboundAttractionDistribution' in settings &&
      typeof settings.outboundAttractionDistribution !== 'boolean')
    return {message: 'the `outboundAttractionDistribution` setting should be a boolean.'};

  if ('adjustSizes' in settings &&
      typeof settings.adjustSizes !== 'boolean')
    return {message: 'the `adjustSizes` setting should be a boolean.'};

  if ('edgeWeightInfluence' in settings &&
      typeof settings.edgeWeightInfluence !== 'number' &&
      settings.edgeWeightInfluence < 0)
    return {message: 'the `edgeWeightInfluence` setting should be a number >= 0.'};

  if ('scalingRatio' in settings &&
      typeof settings.scalingRatio !== 'number' &&
      settings.scalingRatio < 0)
    return {message: 'the `scalingRatio` setting should be a number >= 0.'};

  if ('strongGravityMode' in settings &&
      typeof settings.strongGravityMode !== 'boolean')
    return {message: 'the `strongGravityMode` setting should be a boolean.'};

  if ('gravity' in settings &&
      typeof settings.gravity !== 'number' &&
      settings.gravity < 0)
    return {message: 'the `gravity` setting should be a number >= 0.'};

  if ('slowDown' in settings &&
      typeof settings.slowDown !== 'number' &&
      settings.slowDown < 0)
    return {message: 'the `slowDown` setting should be a number >= 0.'};

  if ('barnesHutOptimize' in settings &&
      typeof settings.barnesHutOptimize !== 'boolean')
    return {message: 'the `barnesHutOptimize` setting should be a boolean.'};

  if ('barnesHutTheta' in settings &&
      typeof settings.barnesHutTheta !== 'number' &&
      settings.barnesHutTheta < 0)
    return {message: 'the `barnesHutTheta` setting should be a number >= 0.'};

  return null;
};

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

/**
 * Function applying the layout back to the graph.
 *
 * @param {Graph}        graph      - Target graph.
 * @param {Float32Array} NodeMatrix - Node matrix.
 */
exports.applyLayoutChanges = function(graph, NodeMatrix) {
  var nodes = graph.nodes();

  for (var i = 0, j = 0, l = NodeMatrix.length; i < l; i += PPN) {
    graph.setNodeAttribute(nodes[j], 'x', NodeMatrix[i]);
    graph.setNodeAttribute(nodes[j], 'y', NodeMatrix[i + 1]);
    j++;
  }
};

/**
 * Function collecting the layout positions.
 *
 * @param  {Graph}        graph      - Target graph.
 * @param  {Float32Array} NodeMatrix - Node matrix.
 * @return {object}                  - Map to node positions.
 */
exports.collectLayoutChanges = function(graph, NodeMatrix) {
  var nodes = graph.nodes(),
      positions = Object.create(null);

  for (var i = 0, j = 0, l = NodeMatrix.length; i < l; i += PPN) {
    positions[nodes[j]] = {
      x: NodeMatrix[i],
      y: NodeMatrix[i + 1]
    };

    j++;
  }

  return positions;
};
