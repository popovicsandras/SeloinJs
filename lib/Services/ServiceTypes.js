'use strict';

const FACTORY_TYPE_NAME = 'factory';
const FUNCTION_TYPE_NAME = 'function';
const STATIC_TYPE_NAME = 'static';
const CONFIG_TYPE_NAME = 'config';

class ServiceType {
    constructor(name, provider) {
        this.name = name;
        this.provider = provider;
        this.type = null;
    }
}

export class FactoryService extends ServiceType {
    constructor(serviceName, serviceProvider) {
        super(serviceName, serviceProvider);
        this.type = FACTORY_TYPE_NAME;
    }

    static get typeName() {
        return FACTORY_TYPE_NAME;
    }
}

export class FunctionService extends ServiceType {
    constructor(functionName, functionProvider) {
        super(functionName, functionProvider);
        this.type = FUNCTION_TYPE_NAME;
    }

    static get typeName() {
        return FUNCTION_TYPE_NAME;
    }
}

export class StaticService extends ServiceType {
    constructor(staticName, staticInstance) {
        super(staticName, staticInstance);
        this.type = STATIC_TYPE_NAME;
    }

    static get typeName() {
        return STATIC_TYPE_NAME;
    }
}

export class ConfigService extends ServiceType {
    constructor(configName, configInstance) {
        super(configName, configInstance);
        this.type = STATIC_TYPE_NAME;
    }

    static get typeName() {
        return CONFIG_TYPE_NAME;
    }
}