var getConfig = require('hjs-webpack');

module.exports = getConfig({
  in: 'src/index.jsx',
  out: 'public',
  clearBeforeBuild: true,
});
