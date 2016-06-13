'use strict';

import {capitalizeString} from './Helpers/Helpers';

export default class BubblingResolver {

    constructor(injector) {
        this.injector = injector;
    }

    resolve(resolver, serviceName, ...args) {
        const Service = this.lookup(this.injector, serviceName);
        return this.resolveByType(resolver, Service, ...args);
    }

    resolveProvider(resolver, serviceName) {
        const Service = this.lookup(this.injector, serviceName);
        return this.resolveProviderByType(resolver, Service);
    }

    lookup(scope, serviceName) {
        if (scope.has(serviceName)) {
            return scope.get(serviceName);
        }

        if (scope.parent) {
            return this.lookup(scope.parent, serviceName);
        }

        throw new Error(`Dependency not found: ${serviceName}`);
    }

    resolveByType(resolver, Service, ...args) {
        const resolverTypeMethod = resolver[Service.type];
        return resolverTypeMethod.call(resolver, this.injector, Service.provider, ...args);
    }

    resolveProviderByType(resolver, Service) {
        const resolverTypeMethod = resolver[`autoInjected${capitalizeString(Service.type)}`];
        return resolverTypeMethod.call(resolver, this.injector, Service.provider, Service.name);
    }
}
