'use strict';

import constructorPrepender from './injection-strategies/ConstructorPrepender';
import Dependencies from './Dependencies';
import defineReadOnlyProperty from './Helpers';

export default class Injector {

    constructor({ scope = 'root', parent = null, injectMethod = constructorPrepender } = {})
    {
        defineReadOnlyProperty(this, 'dependencies', new Dependencies());
        defineReadOnlyProperty(this, '__parent', parent);
        defineReadOnlyProperty(this, '__inject', injectMethod);
        defineReadOnlyProperty(this, 'scope', scope);
    }

    factory(...args) {
        this.dependencies.register(...args, 'factory');
    }

    function(...args) {
        this.dependencies.register(...args, 'function');
    }

    static(...args) {
        this.dependencies.register(...args, 'static');
    }

    resolve(...args) {
        return this.resolveOnContainer(this, ...args);
    }

    resolveOnContainer(container, serviceName, ...args) {

        if (this.dependencies.has(serviceName)) {
            return this._getService(container, serviceName, ...args);
        }

        if (this.__parent) {
            return this.__parent.resolveOnContainer(container, serviceName, ...args);
        }

        throw new Error(`Dependency not found: ${serviceName}`);
    }

    _getService(container, serviceName, ...args) {
        const Service = this.dependencies.get(serviceName);

        // Preferred code:
        //var injectionStrategy = new InjectionStrategy();
        //return injectionStrategy[Service.type].call(injectionStrategy, container, Service.provider, ...args)

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
        this.dependencies.reset();
    }
}
