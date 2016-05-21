'use strict';

import ParamListPrepender from './resolvers/ParamListPrepender';
import Dependencies from './Dependencies';
import defineReadOnlyProperty from './Helpers';

export default class Injector {

    constructor({ scope = 'root', parent = null, resolver = new ParamListPrepender() } = {})
    {
        defineReadOnlyProperty(this, 'dependencies', new Dependencies());
        defineReadOnlyProperty(this, 'parent', parent);
        defineReadOnlyProperty(this, 'resolver', resolver);
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

        if (this.parent) {
            return this.parent.resolveOnContainer(container, serviceName, ...args);
        }

        throw new Error(`Dependency not found: ${serviceName}`);
    }

    _getService(container, serviceName, ...args) {
        const Service = this.dependencies.get(serviceName);
        return this.resolver[Service.type].call(this.resolver, container, Service.provider, ...args)

        //if (Service.type === 'factory') {
        //    return this.resolver(container, Service.provider, ...args);
        //}
        //else if(Service.type === 'function') {
        //    const fn = Service.provider;
        //    return fn(...args);
        //}
        //else {
        //    return Service.provider;
        //}
    }

    createChild(scope) {
        if (!scope) {
            throw new Error(`Scope can't be empty`);
        }

        return new Injector({
            scope: scope,
            parent: this,
            resolver: this.resolver
        });
    }

    reset() {
        this.dependencies.reset();
    }
}
