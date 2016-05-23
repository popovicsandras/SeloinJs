'use strict';

export default class SimpleResolver {
    factory(injector, Service, ...args) {
        return new Service(...args);
    }

    function(injector, service, ...args) {
        return service(...args);
    }

    static(injector, instance) {
        return instance;
    }
}