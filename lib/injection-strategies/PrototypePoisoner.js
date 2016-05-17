'use strict';

module.exports = function(injector, Service, ...args) {

    const oldPrototypeInjector = Service.prototype.injector;
    Service.prototype.injector = injector;

    const service = new Service(...args);
    service.injector = injector;

    Service.prototype.injector = oldPrototypeInjector;

    return service;
};