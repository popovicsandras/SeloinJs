'use strict';

import constructorPrepender from './injection-strategies/ConstructorPrepender.js';

function defineReadOnlyProperty(object, propertyName, value) {
    Object.defineProperty(object, propertyName, {
        value: value,
        writable: false
    });
}

export default class Injector {

    constructor({ scope = 'root', parent = null, injectMethod = constructorPrepender } = {})
    {
        defineReadOnlyProperty(this, '__registry', new Map());
        defineReadOnlyProperty(this, '__parent', parent);
        defineReadOnlyProperty(this, '__inject', injectMethod);
        defineReadOnlyProperty(this, 'scope', scope);
    }

    load(config) {
        //for (let serviceName in config) {
        //    if (config.hasOwnProperty(serviceName)) {
        //        registrator(serviceName, config[serviceName]);
        //    }
        //}
    }

    factory(...args) {
        this._register(...args, 'factory');
    }

    function(...args) {
        this._register(...args, 'function');
    }

    static(...args) {
        this._register(...args, 'static');
    }

    _register(serviceName, serviceProvider, type) {
        if (this._isRegisteredOnCurrentContainer(serviceName)) {
            throw new Error(`Dependency is already registered: ${serviceName}`);
        }

        this.__registry.set(serviceName, {
            provider: serviceProvider,
            type: type
        });
    }

    resolve(...args) {
        return this.resolveOnContainer(this, ...args);
    }

    createChild(scope) {
        if (!scope) {
            throw new Error(`Scope can't be empty`);
        }

        return new Injector({
            scope: scope,
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

        if (Service.type === 'factory') {
            return this.__inject(container, Service.provider, ...args);
        }
        else if(Service.type === 'function') {
            const fn = Service.provider;
            return fn(...args);
        }
        else {
            return Service.provider;
        }
    }

    _isRegisteredOnCurrentContainer(serviceName) {
        return this.__registry.has(serviceName);
    }

    _getOwnRegistered(serviceName) {
        return this.__registry.get(serviceName);
    }
}
