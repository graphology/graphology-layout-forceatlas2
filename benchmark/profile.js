var Graph = require('graphology');
var generateClusters = require('graphology-generators/random/clusters');
var layout = require('../');

var ORDER = 5000;
var SIZE = 10000;
var CLUSTERS = 10;

var graph = generateClusters(Graph.UndirectedGraph, {order: ORDER, size: SIZE, clusters: CLUSTERS});

console.time('layout');
console.profile('layout');
layout(graph, {iterations: 1, settings: {barnesHutOptimize: true}});
console.profileEnd('layout');
console.timeEnd('layout');
