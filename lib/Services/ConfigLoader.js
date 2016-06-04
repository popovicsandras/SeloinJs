'use strict';

import {capitalizeString} from '../Helpers/Helpers';
import {FactoryService, FunctionService, StaticService, ConfigService} from './ServiceTypes';

const serviceTypes = [
    FactoryService.typeName,
    FunctionService.typeName,
    StaticService.typeName,
    ConfigService.typeName
];

export default class ConfigLoader {
    constructor(services) {
        this.services = services;
    }

    load(defaultConfigObject, scopeConfigObject) {

        let config = this._computeConfig(defaultConfigObject, scopeConfigObject);
        this._load(config);
    }

    _computeConfig(defaultConfigObject, scopeConfigObject) {

        let config = this._getEmptyConfig();

        for (let i in serviceTypes) {
            const serviceType = serviceTypes[i];
            this._merge(config[serviceType], defaultConfigObject[serviceType]);
            this._merge(config[serviceType], scopeConfigObject[serviceType]);
        }

        return config;
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

    _load(config) {
        for (let i in serviceTypes) {
            this._loadType(config, serviceTypes[i]);
        }
    }

    _loadType(config, type) {
        const registerMethod = `register${capitalizeString(type)}`,
            typeConfig = config[type];

        for (let serviceName in typeConfig) {
            if (typeConfig.hasOwnProperty(serviceName)) {
                this.services[registerMethod].call(this.services, serviceName, typeConfig[serviceName]);
            }
        }
    }
}