'use strict';

import defineReadOnlyProperty from './Helpers';

export default class Dependencies {

    constructor() {
        defineReadOnlyProperty(this, 'registry', new Map());
    }

    load(config) {
        //for (let serviceName in config) {
        //    if (config.hasOwnProperty(serviceName)) {
        //        registrator(serviceName, config[serviceName]);
        //    }
        //}
    }

    register(serviceName, serviceProvider, type) {
        if (this.registry.has(serviceName)) {
            throw new Error(`Dependency is already registered: ${serviceName}`);
        }

        this.registry.set(serviceName, {
            provider: serviceProvider,
            type: type
        });
    }

    reset() {
        this.registry.clear();
    }

    has(serviceName) {
        return this.registry.has(serviceName);
    }

    get(serviceName) {
        return this.registry.get(serviceName);
    }
}
