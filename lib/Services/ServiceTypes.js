'use strict';

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
        this.type = 'factory';
    }
}

export class FunctionService extends ServiceType {
    constructor(functionName, functionProvider) {
        super(functionName, functionProvider);
        this.type = 'function';
    }
}

export class StaticService extends ServiceType {
    constructor(staticName, staticInstance) {
        super(staticName, staticInstance);
        this.type = 'static';
    }
}