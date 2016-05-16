'use strict';

function defineReadOnlyProperty(object, propertyName, value) {
    Object.defineProperty(object, propertyName, {
        value: value,
        writable: false
    });
}

class Container {

    constructor(name = 'Composition Root', parent = null) {
        this.__registry = new Map();

        defineReadOnlyProperty(this, 'namespace', name);
        defineReadOnlyProperty(this, '__parent', parent);
    }

    register(serviceName, serviceProvider) {
        if (this._isRegisteredOnCurrentContainer(serviceName)) {
            const registeredService = this._getOwnRegistered(serviceName).name;
            throw new Error(`Dependency is already registered: ${serviceName} -> ${registeredService}`);
        }

        this.__registry.set(serviceName, serviceProvider);
    }

    resolve(serviceName, ...args) {
        return this.resolveOnContainer(this, serviceName, ...args);
    }

    createNamespace(name = '') {
        return new Container(name, this);
    }

    reset() {
        this.__registry.clear();
    }

    resolveOnContainer(container, serviceName, ...args) {

        if (this._isRegisteredOnCurrentContainer(serviceName)) {
            return this._getService(container, serviceName, ...args);
        }

        if (this.__parent) {
            return this.__parent.resolveOnContainer(container, serviceName, ...args);
        }

        throw new Error(`Dependency not found: ${serviceName}`);
    }

    _getService(container, serviceName, ...args) {
        const Service = this._getOwnRegistered(serviceName);

        if (typeof Service === 'function') {
            return new Service(container, ...args);
        } else {
            return Service;
        }
    }

    _isRegisteredOnCurrentContainer(serviceName) {
        return this.__registry.has(serviceName);
    }

    _getOwnRegistered(serviceName) {
        return this.__registry.get(serviceName);
    }
}

module.exports = Container;