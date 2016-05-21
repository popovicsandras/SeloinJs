'use strict';

export default class PrototypePoisoner {

    factory(injector, Service, ...args) {

        const oldPrototypeInjector = Service.prototype.injector;
        Service.prototype.injector = injector;

        const service = new Service(...args);
        service.injector = injector;

        Service.prototype.injector = oldPrototypeInjector;

        return service;
    }

    function(injector, service, ...args) {
        const context = { injector: injector };
        return service.call(context, ...args);
    }

    static(injector, instance) {
        return instance;
    }
};