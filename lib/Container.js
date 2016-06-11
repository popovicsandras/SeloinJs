'use strict';

import SimpleResolver from './Resolvers/SimpleResolver';
import Services from './Services/Services';
import ConfigLoader from './Services/ConfigLoader';
import BubblingResolver from './BubblingResolver';
import defineReadOnlyProperty from './Helpers/Helpers';

export default class Container {

    constructor({ scope = 'root', parent = null, resolver = new SimpleResolver() } = {}) {
        defineReadOnlyProperty(this, 'parent', parent);
        defineReadOnlyProperty(this, 'resolver', resolver);
        defineReadOnlyProperty(this, 'scope', scope);

        defineReadOnlyProperty(this, 'services', new Services());
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

        return new Container({
            scope: scope,
            parent: this,
            resolver: resolver
        });
    }

    initScope(defaultConfigObject = {}) {
        const configLoader = new ConfigLoader(this.services);
        configLoader.load(defaultConfigObject, this._getScopeConfig());
    }

    config(configObject) {
        this.configScope(this.scope, configObject);
    }

    configScope(name, configObject) {
        this.services.registerConfig(name, configObject);
    }

    factory(...args) {
        this.services.registerFactory(...args);
    }

    function(...args) {
        this.services.registerFunction(...args);
    }

    static(...args) {
        this.services.registerStatic(...args);
    }

    resolve(serviceName, ...args) {
        return this.bubblingResolver.resolve(this.resolver, serviceName, ...args);
    }

    resolveProvider(serviceName) {
        return this.bubblingResolver.resolveProvider(this.resolver, serviceName);
    }

    reset() {
        this.services.reset();
    }

    has(serviceName) {
        return this.services.has(serviceName);
    }

    get(serviceName) {
        return this.services.get(serviceName);
    }

    _getScopeConfig() {
        let scopeConfig;
        try {
            const currentScopeConfigName = this.services.getConfigName(this.scope);
            scopeConfig = this.resolve(currentScopeConfigName);
        }
        catch(e) {
            scopeConfig = {};
        }

        return scopeConfig;
    }
}
