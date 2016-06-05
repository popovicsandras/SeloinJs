var webpackConfig = require('./webpack.dev-server.config.js');

webpackConfig.devtool = 'source-map';
webpackConfig.output.filename = "seloin.min.js";
module.exports = webpackConfig;
