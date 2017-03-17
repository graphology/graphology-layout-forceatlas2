var path = require('path');

var production = !!~process.argv.indexOf('-p');

module.exports = {
  entry: './index.js',
  output: {
    filename: production ? 'graphology-layout-forceatlas2.min.js' : 'graphology-layout-forceatlas2.js',
    path: path.join(__dirname, 'build'),
    library: 'forceAtlas2',
    libraryTarget: 'umd'
  }
};
