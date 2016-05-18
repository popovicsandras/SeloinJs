var path = require('path'),
    webpack = require('webpack');

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('webpack-common.js');

module.exports = {
    debug: true,
    context: path.resolve('lib'),
    entry: './package.js',
    output: {
        path: path.join(__dirname, "build"),
        publicPath: '/',
        filename: "depex.js",
        libraryTarget: 'umd'
    },

    devServer: {
        contentBase: './public',
        inline: true,
        port: 3000,
        host: 'localhost',
        outputPath: path.join(__dirname, 'build')
    },

    module: {
        preLoaders: [
            { test: /\.js?$/, loader: 'eslint-loader', exclude: /node_modules/ }
        ],

        loaders: [
            { test: /\.js?$/, loader: 'babel-loader', exclude: /node_modules/ }
        ]
    },

     plugins: [
         commonsPlugin
     ],

    resolve: {
        extensions: ['', '.js']
    },

    eslint: {
        configFile: '.eslintrc'
    }
};
