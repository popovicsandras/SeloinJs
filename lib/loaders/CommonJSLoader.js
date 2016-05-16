class CommonJsLoader {

    load(filename, registrator) {
        var config = require(filename);

        for (var serviceName in config) {
            if (config.hasOwnProperty(serviceName)) {
                registrator(serviceName, config[serviceName]);
            }
        }
    }
}

module.exports = CommonJsLoader;