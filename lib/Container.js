'use strict';

import NoInjection from './Injectors/NoInjection';
import Services from './Services/Services';
import ConfigLoader from './Services/ConfigLoader';
import BubblingResolver from './BubblingResolver';
import defineReadOnlyProperty from './Helpers/Helpers';

export default class Container {

    constructor({ scope = 'root', parent = null, injector = new NoInjection() } = {}) {
        defineReadOnlyProperty(this, 'parent', parent);
        defineReadOnlyProperty(this, 'injector', injector);
        defineReadOnlyProperty(this, 'scope', scope);

        defineReadOnlyProperty(this, 'services', new Services());
        defineReadOnlyProperty(this, 'bubblingResolver', new BubblingResolver(this));
    }

    createChild(childScopeParams) {
        let injector = this.injector,
            scope = childScopeParams;

        if (typeof childScopeParams === 'object') {
            injector = childScopeParams.injector ? childScopeParams.injector : injector;
            scope = childScopeParams.scope;
        }

        if (!scope) {
            throw new Error(`Scope name can't be empty`);
        }

        return new Container({
            scope: scope,
            parent: this,
            injector: injector
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
        return this.bubblingResolver.resolve(this.injector, serviceName, ...args);
    }

    resolveProvider(serviceName) {
        return this.bubblingResolver.resolveProvider(this.injector, serviceName);
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
