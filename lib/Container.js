'use strict';

class Container {

    constructor() {
        this.__registry = new Map();
    }

    register(serviceName, serviceProvider) {
        if (this.__registry.has(serviceName)) {
            const registeredService = this.__registry.get(serviceName).name;
            throw new Error(`Dependency is already registered: ${serviceName} -> ${registeredService}`);
        }

        this.__registry.set(serviceName, serviceProvider);
    }

    resolve(serviceName, ...args) {
        if (!this.__registry.has(serviceName)) {
            throw new Error(`Dependency not found: ${serviceName}`);
        }

        const Service = this.__registry.get(serviceName);
        return new Service(this, ...args);
    }
}

module.exports = Container;