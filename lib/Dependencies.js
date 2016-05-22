'use strict';

import {default as defineReadOnlyProperty, capitalizeString} from './Helpers';

export default class Dependencies {

    constructor() {
        defineReadOnlyProperty(this, 'registry', new Map());
    }

    load(config) {
        this.loadType(config, 'factory');
        this.loadType(config, 'function');
        this.loadType(config, 'static');
        this.loadType(config, 'config');
    }

    loadType(config, type) {
        const registerMethod = `register${capitalizeString(type)}`,
            typeConfig = config[type];

        for (let serviceName in typeConfig) {
            if (typeConfig.hasOwnProperty(serviceName)) {
                this[registerMethod].call(this, serviceName, typeConfig[serviceName]);
            }
        }
    }

    getConfigName(name) {
        return `config:${name}`;
    }

    registerConfig(scopeName, configObject) {
        const configName = this.getConfigName(scopeName);
        this.register(configName, configObject, 'static');
    }

    registerFactory(factoryName, factoryProvider) {
        this.register(factoryName, factoryProvider, 'factory');
    }

    registerFunction(functionName, functionProvider) {
        this.register(functionName, functionProvider, 'function');
    }

    registerStatic(staticName, staticInstance) {
        this.register(staticName, staticInstance, 'static');
    }

    register(serviceName, serviceProvider, type) {
        if (this.registry.has(serviceName)) {
            throw new Error(`Dependency is already registered: ${serviceName}`);
        }

        this.registry.set(serviceName, {
            provider: serviceProvider,
            type: type
        });
    }

    reset() {
        this.registry.clear();
    }

    has(serviceName) {
        return this.registry.has(serviceName);
    }

    get(serviceName) {
        return this.registry.get(serviceName);
    }

    get size() {
        return this.registry.size;
    }
}
