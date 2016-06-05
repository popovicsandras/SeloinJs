var path = require('path'),
    webpack = require('webpack');

module.exports = {
    debug: true,
    context: path.resolve('lib'),
    entry: './seloin.js',
    output: {
        path: path.join(__dirname, "build"),
        publicPath: '/',
        filename: "seloin.js",
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

    resolve: {
        extensions: ['', '.js']
    },

    eslint: {
        configFile: '.eslintrc'
    }
};
