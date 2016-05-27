'use strict';

import ParamListPrepender from './resolvers/ParamListPrepender';
import Dependencies from './Dependencies';
import BubblingResolver from './BubblingResolver';
import defineReadOnlyProperty from './Helpers';

export default class Injector {

    constructor({ scope = 'root', parent = null, resolver = new ParamListPrepender() } = {}) {
        defineReadOnlyProperty(this, 'parent', parent);
        defineReadOnlyProperty(this, 'resolver', resolver);
        defineReadOnlyProperty(this, 'scope', scope);

        defineReadOnlyProperty(this, 'dependencies', new Dependencies());
        defineReadOnlyProperty(this, 'bubblingResolver', new BubblingResolver(this));
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

    resolve(serviceName, ...args) {
        return this.bubblingResolver.with(this.resolver).resolve(serviceName, ...args);
    }

    resolveProvider(serviceName) {
        return this.bubblingResolver.with(this.resolver).resolveProvider(serviceName);
    }

    reset() {
        this.dependencies.reset();
    }
}
