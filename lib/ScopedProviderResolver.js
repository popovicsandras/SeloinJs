'use strict';

import {capitalizeString} from './Helpers';

export default class ScopedProviderResolver {

    constructor(injector, resolver, serviceName) {
        this.injector = injector;
        this.resolver = resolver;
        this.serviceName = serviceName;
    }

    resolveOn(scope) {
        if (scope.dependencies.has(this.serviceName)) {
            return this.resolveByType(scope);
        }

        if (scope.parent) {
            return this.resolveOn(scope.parent);
        }

        throw new Error(`Dependency not found: ${this.serviceName}`);
    }

    resolveByType(scope) {
        const Service = scope.dependencies.get(this.serviceName),
            resolverTypeMethod = this.resolver[`autoInjected${capitalizeString(Service.type)}`];

        return resolverTypeMethod.call(this.resolver, this.injector, Service.provider, this.serviceName);
    }
}
