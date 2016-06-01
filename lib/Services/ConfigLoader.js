'use strict';

export default class ConfigLoader {
    constructor(services) {
        this.services = services;
    }

    load(defaultConfigObject, scopeConfigObject) {

        let configs = this._getEmptyConfig();
        configs.function = scopeConfigObject.function;
        configs.static = scopeConfigObject.static;
        configs.config = scopeConfigObject.config;

        this._merge(configs.factory, defaultConfigObject.factory);
        this._merge(configs.factory, scopeConfigObject.factory);

        this.services.load(configs);
    }

    _getEmptyConfig() {
        return {
            factory: {},
            function: {},
            static: {},
            config: {}
        };
    }

    _merge(target, source) {
        for (let property in source) {
            if (source.hasOwnProperty(property)) {
                target[property] = source[property];
            }
        }
    }
}