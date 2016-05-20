'use strict';

import defineReadOnlyProperty from './Helpers';

export default class Injector {

    constructor() {
        defineReadOnlyProperty(this, '__registry', new Map());
    }

    load(config) {
        //for (let serviceName in config) {
        //    if (config.hasOwnProperty(serviceName)) {
        //        registrator(serviceName, config[serviceName]);
        //    }
        //}
    }

    register(serviceName, serviceProvider, type) {
        if (this.__registry.has(serviceName)) {
            throw new Error(`Dependency is already registered: ${serviceName}`);
        }

        this.__registry.set(serviceName, {
            provider: serviceProvider,
            type: type
        });
    }

    reset() {
        this.__registry.clear();
    }

    has(serviceName) {
        return this.__registry.has(serviceName);
    }

    get(serviceName) {
        return this.__registry.get(serviceName);
    }
}
