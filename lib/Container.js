'use strict';

class Container {

    constructor() {
        this.__registry = new Map();
        this.__parent = null;
        this.namespace = 'Composition Root';
    }

    register(serviceName, serviceProvider) {
        if (this.__registry.has(serviceName)) {
            const registeredService = this.__registry.get(serviceName).name;
            throw new Error(`Dependency is already registered: ${serviceName} -> ${registeredService}`);
        }

        this.__registry.set(serviceName, serviceProvider);
    }

    resolve(serviceName, ...args) {
        return this.resolveOnContainer(this, serviceName, ...args);
    }

    resolveOnContainer(container, serviceName, ...args) {

        if (this.__registry.has(serviceName)) {
            const Service = this.__registry.get(serviceName);
            return new Service(container, ...args);
        }

        if (this.__parent) {
            return this.__parent.resolveOnContainer(container, serviceName, ...args);
        }

        throw new Error(`Dependency not found: ${serviceName}`);
    }

    createNamespace(name) {
        const container =  new Container();
        container.__parent = this;
        Object.defineProperty(container, 'namespace', {
            value: name || '',
            writable: false
        });

        return container;
    }
}

module.exports = Container;