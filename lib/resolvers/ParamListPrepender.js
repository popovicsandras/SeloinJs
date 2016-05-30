'use strict';

export default class ParamListPrepender {

    factory(injector, Service, ...args) {
        return new Service(injector, ...args);
    }

    function(injector, service, ...args) {
        return service(injector, ...args);
    }

    autoInjectedFactory(injector, Service, ServiceName) {
        let Surrogate = function(...args) {
            Service.call(this, injector, ...args);
        };
        Surrogate.prototype = Object.create(Service.prototype);
        Surrogate.prototype.constructor = Surrogate;
        Surrogate.__origin__ = ServiceName;
        return Surrogate;
    }

    autoInjectedFunction(injector, service, serviceName) {
        let Surrogate = function(...args) {
            return service.call(this, injector, ...args);
        };
        Surrogate.__origin__ = serviceName;
        return Surrogate;
    }

    static(injector, instance) {
        return instance;
    }

    autoInjectedStatic(...args) {
        return this.static(...args);
    }
}