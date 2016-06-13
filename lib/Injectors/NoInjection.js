'use strict';

export default class NoInjection {
    factory(injector, Service, ...args) {
        return new Service(...args);
    }

    function(injector, service, ...args) {
        return service(...args);
    }

    autoInjectedFactory(injector, Service, ServiceName) {
        return Service;
    }

    autoInjectedFunction(injector, service, ServiceName) {
        return service;
    }

    static(injector, instance) {
        return instance;
    }
}