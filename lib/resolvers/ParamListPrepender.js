'use strict';

export default class ParamListPrepender {
    factory(injector, Service, ...args) {
        return new Service(injector, ...args);
    }

    function(injector, service, ...args) {
        return service(injector, ...args);
    }

    static(injector, instance) {
        return instance;
    }
}