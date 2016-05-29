'use strict';

export default class ServiceMap {
    constructor() {
        this.reset()
    }

    reset() {
        this.registry = {};
    }

    has(serviceName) {
        return this.registry.hasOwnProperty(serviceName);
    }

    get(serviceName) {
        return this.registry[serviceName];
    }

    set(service) {
        this.registry[service.name] = {
            name: service.name,
            provider: service.provider,
            type: service.type
        };
    }

    get size() {
        return Object.keys(this.registry).length;
    }
}