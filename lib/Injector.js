'use strict';

import constructorPrepender from './injection-strategies/ConstructorPrepender.js';

function defineReadOnlyProperty(object, propertyName, value) {
    Object.defineProperty(object, propertyName, {
        value: value,
        writable: false
    });
}

export default class Injector {

    constructor({ name = 'Composition Root', parent = null, injectMethod = constructorPrepender } = {})
    {
        defineReadOnlyProperty(this, '__registry', new Map());
        defineReadOnlyProperty(this, '__parent', parent);
        defineReadOnlyProperty(this, '__inject', injectMethod);
        defineReadOnlyProperty(this, 'namespace', name);
    }

    load(config) {
        //for (let serviceName in config) {
        //    if (config.hasOwnProperty(serviceName)) {
        //        registrator(serviceName, config[serviceName]);
        //    }
        //}
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
            injectMethod: this.__inject
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
            return this.__inject(container, Service, ...args);
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
