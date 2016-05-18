'use strict';

export default class CommonJsLoader {

    constructor(require) {
        this.require = require;
    }

    load(filename, registrator) {
        const config = this.require(filename);

        for (let serviceName in config) {
            if (config.hasOwnProperty(serviceName)) {
                registrator(serviceName, config[serviceName]);
            }
        }
    }
}
