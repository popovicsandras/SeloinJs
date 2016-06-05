'use strict';

export default class ParamListAppender {
    factory(injector, Service, ...args) {
        return new Service(...args, injector);
    }

    function(injector, service, ...args) {
        return service(...args, injector);
    }

    static(injector, instance) {
        return instance;
    }
}