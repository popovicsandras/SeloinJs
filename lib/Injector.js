'use strict';

const DEFAULT_OPTIONS = {
    name: 'Composition Root',
    parent: null,
    loader: new (require('./loaders/CommonJSLoader.js'))()
};

function defineReadOnlyProperty(object, propertyName, value) {
    Object.defineProperty(object, propertyName, {
        value: value,
        writable: false
    });
}

class Injector {

    constructor({name, parent, loader} = DEFAULT_OPTIONS) {
        defineReadOnlyProperty(this, '__registry', new Map());
        defineReadOnlyProperty(this, '__parent', parent);
        defineReadOnlyProperty(this, 'namespace', name);
        defineReadOnlyProperty(this, 'loader', loader);
    }

    load(filename) {
        this.loader.load(filename, this.register.bind(this));
    }

    register(serviceName, serviceProvider) {
        if (this._isRegisteredOnCurrentContainer(serviceName)) {
            const registeredService = this._getOwnRegistered(serviceName).name;
            throw new Error(`Dependency is already registered: ${serviceName} -> ${registeredService}`);
        }

        this.__registry.set(serviceName, serviceProvider);
    }

    resolve(...args) {
        return this.resolveOnContainer(this, ...args);
    }

    createNamespace(name = '') {
        return new Injector({
            name: name,
            parent: this,
            loader: this.loader
        });
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

module.exports = Injector;