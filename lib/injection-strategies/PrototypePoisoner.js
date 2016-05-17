'use strict';

function createSurrogate(injector, oldPrototype) {
    function Surrogate() {
        this.injector = injector;
    }
    Surrogate.prototype = oldPrototype;
    return Surrogate;
}

function poisonPrototypeOf(Service, injector) {
    const oldPrototype = Service.prototype;
    const Surrogate = createSurrogate(injector, oldPrototype);
    Service.prototype = new Surrogate();

    return oldPrototype;
}

function antidotePrototypeOf(Service, oldPrototype) {
    Service.prototype = oldPrototype;
}

//module.exports = function(injector, Service, ...args) {
//    const oldPrototype = poisonPrototypeOf(Service, injector),
//        service = new Service(...args);
//
//    antidotePrototypeOf(Service, oldPrototype);
//    return service;
//};

module.exports = function(injector, Service, ...args) {

    //const oldPrototypeInjector = Service.prototype.injector;
    Service.prototype.injector = injector;

    const service = new Service(...args);
    service.injector = injector;

    Service.prototype.injector = undefined;
    //Service.prototype.injector = oldPrototypeInjector;

    return service;
};