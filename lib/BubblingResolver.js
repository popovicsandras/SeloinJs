'use strict';

import {capitalizeString} from './Helpers';

export default class BubblingResolver {

    constructor(injector, resolver, serviceName) {
        this.injector = injector;
        this.resolver = resolver;
        this.serviceName = serviceName;
    }

    resolve(...args) {
        const Service = this.lookup(this.injector);
        return this.resolveByType(Service, ...args);
    }

    resolveProvider() {
        const Service = this.lookup(this.injector);
        return this.resolveProviderByType(Service);
    }

    lookup(scope) {
        if (scope.dependencies.has(this.serviceName)) {
            return scope.dependencies.get(this.serviceName);
        }

        if (scope.parent) {
            return this.lookup(scope.parent);
        }

        throw new Error(`Dependency not found: ${this.serviceName}`);
    }

    resolveByType(Service, ...args) {
        const resolverTypeMethod = this.resolver[Service.type];
        return resolverTypeMethod.call(this.resolver, this.injector, Service.provider, ...args);
    }

    resolveProviderByType(Service) {
        const resolverTypeMethod = this.resolver[`autoInjected${capitalizeString(Service.type)}`];
        return resolverTypeMethod.call(this.resolver, this.injector, Service.provider, this.serviceName);
    }
}
