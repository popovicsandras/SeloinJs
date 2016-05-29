'use strict';

import {default as defineReadOnlyProperty, capitalizeString} from '../Helpers';
import * as ServiceTypes from './ServiceTypes';
import ServiceMap  from './ServiceMap';

export default class Services {

    constructor() {
        this.store = new ServiceMap();
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
        const configService = new ServiceTypes.StaticService(configName, configObject);
        this.register(configService);
    }

    registerFactory(factoryName, factoryProvider) {
        const factoryService = new ServiceTypes.FactoryService(factoryName, factoryProvider);
        this.register(factoryService);
    }

    registerFunction(functionName, functionProvider) {
        const functionService = new ServiceTypes.FunctionService(functionName, functionProvider);
        this.register(functionService);
    }

    registerStatic(staticName, staticInstance) {
        const staticService = new ServiceTypes.StaticService(staticName, staticInstance);
        this.register(staticService);
    }

    register(service) {
        if (this.has(service.name)) {
            throw new Error(`Dependency is already registered: ${service.name}`);
        }

        this.set(service);
    }

    reset() {
        this.store.reset();
    }

    has(serviceName) {
        return this.store.has(serviceName);
    }

    get(serviceName) {
        return this.store.get(serviceName);
    }

    set(service) {
        this.store.set(service);
    }

    get size() {
        return this.store.size;
    }
}
