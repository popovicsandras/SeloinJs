'use strict';

import ParamListPrepender from './resolvers/ParamListPrepender';
import Services from './Services';
import BubblingResolver from './BubblingResolver';
import defineReadOnlyProperty from './Helpers';

export default class Injector {

    constructor({ scope = 'root', parent = null, resolver = new ParamListPrepender() } = {}) {
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

        return new Injector({
            scope: scope,
            parent: this,
            resolver: resolver
        });
    }

    initScope() {
        try {
            const currentScopeConfigName = this.services.getConfigName(this.scope);
            this.services.load(this.resolve(currentScopeConfigName));
        }
        catch(e) {
            // Logger.warn('No scope config was found');
        }
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
}
