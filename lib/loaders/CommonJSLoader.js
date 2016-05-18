'use strict';

class CommonJsLoader {

    load(filename, registrator) {
        const config = require(filename);

        for (let serviceName in config) {
            if (config.hasOwnProperty(serviceName)) {
                registrator(serviceName, config[serviceName]);
            }
        }
    }
}

module.exports = CommonJsLoader;
