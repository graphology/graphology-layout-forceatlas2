/**
 * Graphology ForceAtlas2 Layout Supervisor
 * =========================================
 *
 * Supervisor class able to spawn a web worker to run the FA2 layout in a
 * separate thread not to block UI with heavy synchronous computations.
 */
var Worker = require('worker-loader?inline&fallback=false!./webworker.js'),
    isGraph = require('graphology-utils/is-graph'),
    helpers = require('./helpers.js');

var DEFAULT_SETTINGS = require('./defaults.js');

/**
 * Class representing a FA2 layout run by a webworker.
 *
 * @constructor
 * @param  {Graph}         graph        - Target graph.
 * @param  {object|number} params       - Parameters:
 * @param  {object}          [settings] - Settings.
 */
function FA2LayoutSupervisor(graph, params) {

  // Validation
  if (!isGraph(graph))
    throw new Error('graphology-layout-forceatlas2/worker: the given graph is not a valid graphology instance.');

  // Validating settings
  var settings = helpers.assign({}, DEFAULT_SETTINGS, params.settings),
      validationError = helpers.validateSettings(settings);

  if (validationError)
    throw new Error('graphology-layout-forceatlas2/worker: ' + validationError.message);

  // Properties
  this.worker = new Worker();
  this.graph = graph;
  this.settings = settings;
  this.matrices = null;

  // Binding listener
  this.worker.addEventListener('message', this.handleMessage.bind(this));
}

/**
 * Internal method used to handle the worker's messages.
 *
 * @param {object} event - Event to handle.
 */
FA2LayoutSupervisor.prototype.handleMessage = function(event) {
  var matrix = new Float32Array(event.data.nodes);

  helpers.applyLayoutChanges(this.graph, matrix);

  // Looping
  this.askForIterations();
};

/**
 * Internal method used to ask for iterations from the worker.
 *
 * @param  {boolean} withEdges - Should we send edges along?
 * @return {FA2LayoutSupervisor}
 */
FA2LayoutSupervisor.prototype.askForIterations = function(withEdges) {
  var matrices = this.matrices;

  var payload = {
    settings: this.settings,
    nodes: matrices.nodes.buffer
  };

  var buffers = [matrices.nodes.buffer];

  if (withEdges) {
    payload.edges = matrices.edges.buffer;
    buffers.push(matrices.edges.buffer);
  }

  this.worker.postMessage(payload, buffers);

  return this;
};

/**
 * Method used to start the layout.
 *
 * @return {FA2LayoutSupervisor}
 */
FA2LayoutSupervisor.prototype.start = function() {

  // Building matrices
  this.matrices = helpers.graphToByteArrays(this.graph);

  this.askForIterations(true);

  return this;
};
