'use strict';

export default class ScopedResolver {

    constructor(injector, resolver, serviceName, ...args) {
        this.injector = injector;
        this.resolver = resolver;
        this.serviceName = serviceName;
        this.arguments = [...args];
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
            resolverTypeMethod = this.resolver[Service.type];

        return resolverTypeMethod.call(this.resolver, this.injector, Service.provider, ...this.arguments);
    }
}
