'use strict';

module.exports = function(injector, Service, ...args) {
    return new Service(...args, injector);
};