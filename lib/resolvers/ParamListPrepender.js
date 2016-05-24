'use strict';

export default class ParamListPrepender {

    factory(injector, Service, ...args) {
        return new Service(injector, ...args);
    }

    autoInjectedFactory(injector, Service, serviceName) {
        let Surrogate = function(...args) {
            Service.call(this, injector, ...args);
        };
        Surrogate.prototype = Object.create(Service.prototype);
        Surrogate.prototype.constructor = Surrogate;
        Surrogate.__origin__ = serviceName;
        return Surrogate;
    }

    function(injector, service, ...args) {
        return service(injector, ...args);
    }

    static(injector, instance) {
        return instance;
    }
}