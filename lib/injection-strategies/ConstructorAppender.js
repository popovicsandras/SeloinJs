'use strict';

export default function(injector, Service, ...args) {
    return new Service(...args, injector);
};
