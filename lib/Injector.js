'use strict';

import ParamListPrepender from './resolvers/ParamListPrepender';
import Dependencies from './Dependencies';
import defineReadOnlyProperty from './Helpers';

export default class Injector {

    constructor({ scope = 'root', parent = null, resolver = new ParamListPrepender() } = {}) {
        defineReadOnlyProperty(this, 'dependencies', new Dependencies());
        defineReadOnlyProperty(this, 'parent', parent);
        defineReadOnlyProperty(this, 'resolver', resolver);
        defineReadOnlyProperty(this, 'scope', scope);
    }

    createChild(childScopeParams) {
        let resolver = this.resolver,
            scope = childScopeParams;

        if (typeof childScopeParams === 'object') {
            resolver = childScopeParams.resolver ? childScopeParams.resolver : resolver;
            scope = childScopeParams.scope;
        }

        if (!scope) {
            throw new Error(`Scope name can't be empty`);
        }

        return new Injector({
            scope: scope,
            parent: this,
            resolver: resolver
        });
    }

    initScope() {

        try {
            const currentScopeConfigName = this.dependencies.getConfigName(this.scope);
            this.dependencies.load(this.resolve(currentScopeConfigName));
        }
        catch(e) {
            // Logger.warn('No scope config was found');
        }
    }

    config(configObject) {
        this.configScope(this.scope, configObject);
    }

    configScope(name, configObject) {
        this.dependencies.registerConfig(name, configObject);
    }

    factory(...args) {
        this.dependencies.registerFactory(...args);
    }

    function(...args) {
        this.dependencies.registerFunction(...args);
    }

    static(...args) {
        this.dependencies.registerStatic(...args);
    }

    resolve(...args) {
        return this.resolveOnContainer(this, ...args);
    }

    resolveOnContainer(container, serviceName, ...args) {

        if (this.dependencies.has(serviceName)) {
            const Service = this.dependencies.get(serviceName);
            return container.resolver[Service.type].call(container.resolver, container, Service.provider, ...args);
        }

        if (this.parent) {
            return this.parent.resolveOnContainer(container, serviceName, ...args);
        }

        throw new Error(`Dependency not found: ${serviceName}`);
    }

    reset() {
        this.dependencies.reset();
    }
}
