var Graph = require('graphology');
var generateClusters = require('graphology-generators/random/clusters');
var layout = require('../');

var graph = generateClusters(Graph.UndirectedGraph, {order: 5000, size: 10000, clusters: 5});

console.time('layout');
console.profile('layout');
layout(graph, {iterations: 1, settings: {barnesHutOptimize: true}});
console.profileEnd('layout');
console.timeEnd('layout');
