var webpackConfig = require('./webpack.dev-server.config.js');

webpackConfig.output = {
    filename: "index.js",
    libraryTarget: 'umd'
};

module.exports = webpackConfig;
