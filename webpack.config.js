var path = require('path');

var production = !!~process.argv.indexOf('-p');

var bundles = [
  {
    entry: './index.js',
    output: {
      filename: production ? 'graphology-layout-forceatlas2.min.js' : 'graphology-layout-forceatlas2.js',
      path: path.join(__dirname, 'build'),
      library: 'forceAtlas2',
      libraryTarget: 'umd'
    }
  }
];

if (!production)
  bundles.push(
    {
      entry: './supervisor.js',
      output: {
        filename: 'worker.js',
        path: path.join(__dirname),
        library: 'FA2LayoutSupervisor',
        libraryTarget: 'umd'
      }
    }
  );

module.exports = bundles;
