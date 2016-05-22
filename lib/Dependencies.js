'use strict';

import defineReadOnlyProperty from './Helpers';

export default class Dependencies {

    constructor() {
        defineReadOnlyProperty(this, 'registry', new Map());
    }

    load(config) {
        const types = ['factory', 'function', 'static'];
        for (let typeIndex in types) {
            this.loadType(config, types[typeIndex]);
        }
    }

    loadType(config, type) {
        for (let serviceName in config[type]) {
            if (config[type].hasOwnProperty(serviceName)) {
                this.register(serviceName, config[type][serviceName], type);
            }
        }
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
