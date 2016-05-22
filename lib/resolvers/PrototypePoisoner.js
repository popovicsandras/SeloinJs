'use strict';

export default class PrototypePoisoner {

    constructor(name = 'injector') {
        this.name = name;
    }

    factory(injector, Service, ...args) {

        const prototypePropertyOldValue = Service.prototype[this.name];
        Service.prototype[this.name] = injector;

        const service = new Service(...args);
        service[this.name] = injector;

        Service.prototype[this.name] = prototypePropertyOldValue;

        return service;
    }

    function(injector, service, ...args) {
        const context = {};
        context[this.name] = injector;
        return service.call(context, ...args);
    }

    static(injector, instance) {
        return instance;
    }
};