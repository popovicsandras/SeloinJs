'use strict';

import {capitalizeString} from './Helpers';

export default class BubblingResolver {

    constructor(injector) {
        this.injector = injector;
        this.currentResolver = null;
        this.currentServiceName = null;
    }

    with(resolver) {
        this.currentResolver = resolver;
        return this;
    }

    resolve(serviceName, ...args) {
        this.currentServiceName = serviceName;
        const Service = this.lookup(this.injector);
        return this.resolveByType(Service, ...args);
    }

    resolveProvider(serviceName) {
        this.currentServiceName = serviceName;
        const Service = this.lookup(this.injector);
        return this.resolveProviderByType(Service);
    }

    lookup(scope) {
        if (scope.dependencies.has(this.currentServiceName)) {
            return scope.dependencies.get(this.currentServiceName);
        }

        if (scope.parent) {
            return this.lookup(scope.parent);
        }

        throw new Error(`Dependency not found: ${this.currentServiceName}`);
    }

    resolveByType(Service, ...args) {
        const resolverTypeMethod = this.currentResolver[Service.type];
        return resolverTypeMethod.call(this.currentResolver, this.injector, Service.provider, ...args);
    }

    resolveProviderByType(Service) {
        const resolverTypeMethod = this.currentResolver[`autoInjected${capitalizeString(Service.type)}`];
        return resolverTypeMethod.call(this.currentResolver, this.injector, Service.provider, this.currentServiceName);
    }
}
