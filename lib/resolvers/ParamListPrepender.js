'use strict';

export default class ParamListPrepender {

    factory(injector, Service, ...args) {
        return new Service(injector, ...args);
    }

    factoryProvider(injector, serviceName, Service) {
        const Surrogate = function(...args) {
            Service.call(this, injector, ...args);
        };
        Surrogate.prototype = Service.prototype;
        return Surrogate;
    }

    function(injector, service, ...args) {
        return service(injector, ...args);
    }

    static(injector, instance) {
        return instance;
    }
}