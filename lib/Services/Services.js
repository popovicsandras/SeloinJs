'use strict';

import {FactoryService, FunctionService, StaticService, ConfigService} from './ServiceTypes';
import ServiceMap  from './ServiceMap';

export default class Services {

    constructor() {
        this.store = new ServiceMap();
    }

    getConfigName(name) {
        return `config:${name}`;
    }

    registerConfig(scopeName, configObject) {
        const configName = this.getConfigName(scopeName);
        const configService = new ConfigService(configName, configObject);
        this.register(configService);
    }

    registerFactory(factoryName, factoryProvider) {
        const factoryService = new FactoryService(factoryName, factoryProvider);
        this.register(factoryService);
    }

    registerFunction(functionName, functionProvider) {
        const functionService = new FunctionService(functionName, functionProvider);
        this.register(functionService);
    }

    registerStatic(staticName, staticInstance) {
        const staticService = new StaticService(staticName, staticInstance);
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
