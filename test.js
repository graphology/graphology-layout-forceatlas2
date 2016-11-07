/**
 * Graphology Utils Unit Tests
 * ============================
 */
var assert = require('assert'),
    Graph = require('graphology');

var helpers = require('./helpers.js');

describe('graphology-layout-forceatlas2', function() {

  describe('helpers', function() {

    describe('#.graphToByteArrays', function() {

      it('should work as expected.', function() {
        var graph = new Graph();
        graph.addNodesFrom({
          John: {
            size: 4,
            x: 3,
            y: 4
          },
          Martha: {
            x: 10,
            y: 5
          },
          Ada: {
            x: 23,
            y: -2
          }
        });
        graph.addEdge('John', 'Martha');
        graph.addEdge('Martha', 'Ada', {weight: 3});

        var matrices = helpers.graphToByteArrays(graph);

        assert.deepEqual(
          Array.from(matrices.nodes),
          [
            3, 4, 0, 0, 0, 0, 2, 1, 4, 0,
            10, 5, 0, 0, 0, 0, 3, 1, 1, 0,
            23, -2, 0, 0, 0, 0, 2, 1, 1, 0
          ]
        );

        assert.deepEqual(
          Array.from(matrices.edges),
          [
            0, 10, 0,
            10, 20, 3
          ]
        );
      });
    });
  });
});
