module.exports = {
    Injector: require('./injector.js'),
    Strategies: {
        ConstructorAppender: require('./injection-strategies/ConstructorAppender.js'),
        ConstructorPrepender: require('./injection-strategies/ConstructorPrepender.js'),
        PrototypePoisoner: require('./injection-strategies/PrototypePoisoner.js')
    },
    Loaders: {
        CommonJS: require('./loaders/CommonJSLoader.js')
    }
};
