'use strict';

import defineReadOnlyProperty from './Helpers';

export default class Dependencies {

    constructor() {
        defineReadOnlyProperty(this, 'registry', new Map());
    }

    load(config) {
        this.loadType(config, 'factory');
        this.loadType(config, 'function');
        this.loadType(config, 'static');
    }

    loadType(config, type) {
        for (let serviceName in config[type]) {
            if (config[type].hasOwnProperty(serviceName)) {
                this.register(serviceName, config[type][serviceName], type);
            }
        }
    }

    getConfigName(name) {
        return `conf:${name}`;
    }

    registerFactory(serviceName, serviceProvider) {
        this.register(serviceName, serviceProvider, 'factory');
    }

    registerFunction(serviceName, serviceProvider) {
        this.register(serviceName, serviceProvider, 'function');
    }

    registerStatic(serviceName, serviceProvider) {
        this.register(serviceName, serviceProvider, 'static');
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

    get size() {
        return this.registry.size;
    }
}
