(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Injectors = exports.Container = undefined;

	var _Container = __webpack_require__(1);

	Object.defineProperty(exports, 'Container', {
	    enumerable: true,
	    get: function get() {
	        return _interopRequireDefault(_Container).default;
	    }
	});

	var _NoInjection = __webpack_require__(2);

	var _NoInjection2 = _interopRequireDefault(_NoInjection);

	var _ParamListAppender = __webpack_require__(9);

	var _ParamListAppender2 = _interopRequireDefault(_ParamListAppender);

	var _ParamListPrepender = __webpack_require__(10);

	var _ParamListPrepender2 = _interopRequireDefault(_ParamListPrepender);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Injectors = {
	    NoInjection: _NoInjection2.default,
	    ParamListAppender: _ParamListAppender2.default,
	    ParamListPrepender: _ParamListPrepender2.default
	};
	exports.Injectors = Injectors;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _NoInjection = __webpack_require__(2);

	var _NoInjection2 = _interopRequireDefault(_NoInjection);

	var _Services = __webpack_require__(3);

	var _Services2 = _interopRequireDefault(_Services);

	var _ConfigLoader = __webpack_require__(6);

	var _ConfigLoader2 = _interopRequireDefault(_ConfigLoader);

	var _BubblingResolver = __webpack_require__(8);

	var _BubblingResolver2 = _interopRequireDefault(_BubblingResolver);

	var _Helpers = __webpack_require__(7);

	var _Helpers2 = _interopRequireDefault(_Helpers);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Container = function () {
	    function Container() {
	        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        var _ref$scope = _ref.scope;
	        var scope = _ref$scope === undefined ? 'root' : _ref$scope;
	        var _ref$parent = _ref.parent;
	        var parent = _ref$parent === undefined ? null : _ref$parent;
	        var _ref$injector = _ref.injector;
	        var injector = _ref$injector === undefined ? new _NoInjection2.default() : _ref$injector;

	        _classCallCheck(this, Container);

	        (0, _Helpers2.default)(this, 'parent', parent);
	        (0, _Helpers2.default)(this, 'injector', injector);
	        (0, _Helpers2.default)(this, 'scope', scope);

	        (0, _Helpers2.default)(this, 'services', new _Services2.default());
	        (0, _Helpers2.default)(this, 'bubblingResolver', new _BubblingResolver2.default(this));
	    }

	    _createClass(Container, [{
	        key: 'createChild',
	        value: function createChild(childScopeParams) {
	            var injector = this.injector,
	                scope = childScopeParams;

	            if ((typeof childScopeParams === 'undefined' ? 'undefined' : _typeof(childScopeParams)) === 'object') {
	                injector = childScopeParams.injector ? childScopeParams.injector : injector;
	                scope = childScopeParams.scope;
	            }

	            if (!scope) {
	                throw new Error('Scope name can\'t be empty');
	            }

	            return new Container({
	                scope: scope,
	                parent: this,
	                injector: injector
	            });
	        }
	    }, {
	        key: 'initScope',
	        value: function initScope() {
	            var defaultConfigObject = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	            var configLoader = new _ConfigLoader2.default(this.services);
	            configLoader.load(defaultConfigObject, this._getScopeConfig());
	        }
	    }, {
	        key: 'config',
	        value: function config(configObject) {
	            this.configScope(this.scope, configObject);
	        }
	    }, {
	        key: 'configScope',
	        value: function configScope(name, configObject) {
	            this.services.registerConfig(name, configObject);
	        }
	    }, {
	        key: 'factory',
	        value: function factory() {
	            var _services;

	            (_services = this.services).registerFactory.apply(_services, arguments);
	        }
	    }, {
	        key: 'function',
	        value: function _function() {
	            var _services2;

	            (_services2 = this.services).registerFunction.apply(_services2, arguments);
	        }
	    }, {
	        key: 'static',
	        value: function _static() {
	            var _services3;

	            (_services3 = this.services).registerStatic.apply(_services3, arguments);
	        }
	    }, {
	        key: 'resolve',
	        value: function resolve(serviceName) {
	            var _bubblingResolver;

	            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                args[_key - 1] = arguments[_key];
	            }

	            return (_bubblingResolver = this.bubblingResolver).resolve.apply(_bubblingResolver, [this.injector, serviceName].concat(args));
	        }
	    }, {
	        key: 'resolveProvider',
	        value: function resolveProvider(serviceName) {
	            return this.bubblingResolver.resolveProvider(this.injector, serviceName);
	        }
	    }, {
	        key: 'reset',
	        value: function reset() {
	            this.services.reset();
	        }
	    }, {
	        key: 'has',
	        value: function has(serviceName) {
	            return this.services.has(serviceName);
	        }
	    }, {
	        key: 'get',
	        value: function get(serviceName) {
	            return this.services.get(serviceName);
	        }
	    }, {
	        key: '_getScopeConfig',
	        value: function _getScopeConfig() {
	            var scopeConfig = void 0;
	            try {
	                var currentScopeConfigName = this.services.getConfigName(this.scope);
	                scopeConfig = this.resolve(currentScopeConfigName);
	            } catch (e) {
	                scopeConfig = {};
	            }

	            return scopeConfig;
	        }
	    }]);

	    return Container;
	}();

	exports.default = Container;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var NoInjection = function () {
	    function NoInjection() {
	        _classCallCheck(this, NoInjection);
	    }

	    _createClass(NoInjection, [{
	        key: 'factory',
	        value: function factory(injector, Service) {
	            for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	                args[_key - 2] = arguments[_key];
	            }

	            return new (Function.prototype.bind.apply(Service, [null].concat(args)))();
	        }
	    }, {
	        key: 'function',
	        value: function _function(injector, service) {
	            for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	                args[_key2 - 2] = arguments[_key2];
	            }

	            return service.apply(undefined, args);
	        }
	    }, {
	        key: 'autoInjectedFactory',
	        value: function autoInjectedFactory(injector, Service, ServiceName) {
	            return Service;
	        }
	    }, {
	        key: 'autoInjectedFunction',
	        value: function autoInjectedFunction(injector, service, ServiceName) {
	            return service;
	        }
	    }, {
	        key: 'static',
	        value: function _static(injector, instance) {
	            return instance;
	        }
	    }]);

	    return NoInjection;
	}();

	exports.default = NoInjection;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _ServiceTypes = __webpack_require__(4);

	var _ServiceMap = __webpack_require__(5);

	var _ServiceMap2 = _interopRequireDefault(_ServiceMap);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Services = function () {
	    function Services() {
	        _classCallCheck(this, Services);

	        this.store = new _ServiceMap2.default();
	    }

	    _createClass(Services, [{
	        key: 'getConfigName',
	        value: function getConfigName(name) {
	            return 'config:' + name;
	        }
	    }, {
	        key: 'registerConfig',
	        value: function registerConfig(scopeName, configObject) {
	            var configName = this.getConfigName(scopeName);
	            var configService = new _ServiceTypes.ConfigService(configName, configObject);
	            this.register(configService);
	        }
	    }, {
	        key: 'registerFactory',
	        value: function registerFactory(factoryName, factoryProvider) {
	            var factoryService = new _ServiceTypes.FactoryService(factoryName, factoryProvider);
	            this.register(factoryService);
	        }
	    }, {
	        key: 'registerFunction',
	        value: function registerFunction(functionName, functionProvider) {
	            var functionService = new _ServiceTypes.FunctionService(functionName, functionProvider);
	            this.register(functionService);
	        }
	    }, {
	        key: 'registerStatic',
	        value: function registerStatic(staticName, staticInstance) {
	            var staticService = new _ServiceTypes.StaticService(staticName, staticInstance);
	            this.register(staticService);
	        }
	    }, {
	        key: 'register',
	        value: function register(service) {
	            if (this.has(service.name)) {
	                throw new Error('Dependency is already registered: ' + service.name);
	            }

	            this.set(service);
	        }
	    }, {
	        key: 'reset',
	        value: function reset() {
	            this.store.reset();
	        }
	    }, {
	        key: 'has',
	        value: function has(serviceName) {
	            return this.store.has(serviceName);
	        }
	    }, {
	        key: 'get',
	        value: function get(serviceName) {
	            return this.store.get(serviceName);
	        }
	    }, {
	        key: 'set',
	        value: function set(service) {
	            this.store.set(service);
	        }
	    }, {
	        key: 'size',
	        get: function get() {
	            return this.store.size;
	        }
	    }]);

	    return Services;
	}();

	exports.default = Services;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var FACTORY_TYPE_NAME = 'factory';
	var FUNCTION_TYPE_NAME = 'function';
	var STATIC_TYPE_NAME = 'static';
	var CONFIG_TYPE_NAME = 'config';

	var ServiceType = function ServiceType(name, provider) {
	    _classCallCheck(this, ServiceType);

	    this.name = name;
	    this.provider = provider;
	    this.type = null;
	};

	var FactoryService = function (_ServiceType) {
	    _inherits(FactoryService, _ServiceType);

	    function FactoryService(serviceName, serviceProvider) {
	        _classCallCheck(this, FactoryService);

	        var _this = _possibleConstructorReturn(this, (FactoryService.__proto__ || Object.getPrototypeOf(FactoryService)).call(this, serviceName, serviceProvider));

	        _this.type = FACTORY_TYPE_NAME;
	        return _this;
	    }

	    _createClass(FactoryService, null, [{
	        key: 'typeName',
	        get: function get() {
	            return FACTORY_TYPE_NAME;
	        }
	    }]);

	    return FactoryService;
	}(ServiceType);

	var FunctionService = function (_ServiceType2) {
	    _inherits(FunctionService, _ServiceType2);

	    function FunctionService(functionName, functionProvider) {
	        _classCallCheck(this, FunctionService);

	        var _this2 = _possibleConstructorReturn(this, (FunctionService.__proto__ || Object.getPrototypeOf(FunctionService)).call(this, functionName, functionProvider));

	        _this2.type = FUNCTION_TYPE_NAME;
	        return _this2;
	    }

	    _createClass(FunctionService, null, [{
	        key: 'typeName',
	        get: function get() {
	            return FUNCTION_TYPE_NAME;
	        }
	    }]);

	    return FunctionService;
	}(ServiceType);

	var StaticService = function (_ServiceType3) {
	    _inherits(StaticService, _ServiceType3);

	    function StaticService(staticName, staticInstance) {
	        _classCallCheck(this, StaticService);

	        var _this3 = _possibleConstructorReturn(this, (StaticService.__proto__ || Object.getPrototypeOf(StaticService)).call(this, staticName, staticInstance));

	        _this3.type = STATIC_TYPE_NAME;
	        return _this3;
	    }

	    _createClass(StaticService, null, [{
	        key: 'typeName',
	        get: function get() {
	            return STATIC_TYPE_NAME;
	        }
	    }]);

	    return StaticService;
	}(ServiceType);

	var ConfigService = function (_ServiceType4) {
	    _inherits(ConfigService, _ServiceType4);

	    function ConfigService(configName, configInstance) {
	        _classCallCheck(this, ConfigService);

	        var _this4 = _possibleConstructorReturn(this, (ConfigService.__proto__ || Object.getPrototypeOf(ConfigService)).call(this, configName, configInstance));

	        _this4.type = STATIC_TYPE_NAME;
	        return _this4;
	    }

	    _createClass(ConfigService, null, [{
	        key: 'typeName',
	        get: function get() {
	            return CONFIG_TYPE_NAME;
	        }
	    }]);

	    return ConfigService;
	}(ServiceType);

	exports.FactoryService = FactoryService;
	exports.FunctionService = FunctionService;
	exports.StaticService = StaticService;
	exports.ConfigService = ConfigService;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ServiceMap = function () {
	    function ServiceMap() {
	        _classCallCheck(this, ServiceMap);

	        this.reset();
	    }

	    _createClass(ServiceMap, [{
	        key: 'reset',
	        value: function reset() {
	            this.registry = {};
	        }
	    }, {
	        key: 'has',
	        value: function has(serviceName) {
	            return this.registry.hasOwnProperty(serviceName);
	        }
	    }, {
	        key: 'get',
	        value: function get(serviceName) {
	            return this.registry[serviceName];
	        }
	    }, {
	        key: 'set',
	        value: function set(service) {
	            this.registry[service.name] = {
	                name: service.name,
	                provider: service.provider,
	                type: service.type
	            };
	        }
	    }, {
	        key: 'size',
	        get: function get() {
	            return Object.keys(this.registry).length;
	        }
	    }]);

	    return ServiceMap;
	}();

	exports.default = ServiceMap;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Helpers = __webpack_require__(7);

	var _ServiceTypes = __webpack_require__(4);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var serviceTypes = [_ServiceTypes.FactoryService.typeName, _ServiceTypes.FunctionService.typeName, _ServiceTypes.StaticService.typeName, _ServiceTypes.ConfigService.typeName];

	var ConfigLoader = function () {
	    function ConfigLoader(services) {
	        _classCallCheck(this, ConfigLoader);

	        this.services = services;
	    }

	    _createClass(ConfigLoader, [{
	        key: 'load',
	        value: function load(defaultConfigObject, scopeConfigObject) {

	            var config = this._computeConfig(defaultConfigObject, scopeConfigObject);
	            this._load(config);
	        }
	    }, {
	        key: '_computeConfig',
	        value: function _computeConfig(defaultConfigObject, scopeConfigObject) {

	            var config = this._getEmptyConfig();

	            for (var i in serviceTypes) {
	                var serviceType = serviceTypes[i];
	                this._merge(config[serviceType], defaultConfigObject[serviceType]);
	                this._merge(config[serviceType], scopeConfigObject[serviceType]);
	            }

	            return config;
	        }
	    }, {
	        key: '_getEmptyConfig',
	        value: function _getEmptyConfig() {
	            return {
	                factory: {},
	                function: {},
	                static: {},
	                config: {}
	            };
	        }
	    }, {
	        key: '_merge',
	        value: function _merge(target, source) {
	            for (var property in source) {
	                if (source.hasOwnProperty(property)) {
	                    target[property] = source[property];
	                }
	            }
	        }
	    }, {
	        key: '_load',
	        value: function _load(config) {
	            for (var i in serviceTypes) {
	                this._loadType(config, serviceTypes[i]);
	            }
	        }
	    }, {
	        key: '_loadType',
	        value: function _loadType(config, type) {
	            var registerMethod = 'register' + (0, _Helpers.capitalizeString)(type),
	                typeConfig = config[type];

	            for (var serviceName in typeConfig) {
	                if (typeConfig.hasOwnProperty(serviceName)) {
	                    this.services[registerMethod].call(this.services, serviceName, typeConfig[serviceName]);
	                }
	            }
	        }
	    }]);

	    return ConfigLoader;
	}();

	exports.default = ConfigLoader;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = defineReadOnlyProperty;
	exports.capitalizeString = capitalizeString;
	function defineReadOnlyProperty(object, propertyName, value) {
	    Object.defineProperty(object, propertyName, {
	        value: value,
	        writable: false
	    });
	}

	function capitalizeString(str) {
	    return str.charAt(0).toUpperCase() + str.slice(1);
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Helpers = __webpack_require__(7);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var BubblingResolver = function () {
	    function BubblingResolver(injector) {
	        _classCallCheck(this, BubblingResolver);

	        this.injector = injector;
	    }

	    _createClass(BubblingResolver, [{
	        key: 'resolve',
	        value: function resolve(resolver, serviceName) {
	            var Service = this.lookup(this.injector, serviceName);

	            for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	                args[_key - 2] = arguments[_key];
	            }

	            return this.resolveByType.apply(this, [resolver, Service].concat(args));
	        }
	    }, {
	        key: 'resolveProvider',
	        value: function resolveProvider(resolver, serviceName) {
	            var Service = this.lookup(this.injector, serviceName);
	            return this.resolveProviderByType(resolver, Service);
	        }
	    }, {
	        key: 'lookup',
	        value: function lookup(scope, serviceName) {
	            if (scope.has(serviceName)) {
	                return scope.get(serviceName);
	            }

	            if (scope.parent) {
	                return this.lookup(scope.parent, serviceName);
	            }

	            throw new Error('Dependency not found: ' + serviceName);
	        }
	    }, {
	        key: 'resolveByType',
	        value: function resolveByType(resolver, Service) {
	            var resolverTypeMethod = resolver[Service.type];

	            for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	                args[_key2 - 2] = arguments[_key2];
	            }

	            return resolverTypeMethod.call.apply(resolverTypeMethod, [resolver, this.injector, Service.provider].concat(args));
	        }
	    }, {
	        key: 'resolveProviderByType',
	        value: function resolveProviderByType(resolver, Service) {
	            var resolverTypeMethod = resolver['autoInjected' + (0, _Helpers.capitalizeString)(Service.type)];
	            return resolverTypeMethod.call(resolver, this.injector, Service.provider, Service.name);
	        }
	    }]);

	    return BubblingResolver;
	}();

	exports.default = BubblingResolver;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ParamListAppender = function () {
	    function ParamListAppender() {
	        _classCallCheck(this, ParamListAppender);
	    }

	    _createClass(ParamListAppender, [{
	        key: 'factory',
	        value: function factory(injector, Service) {
	            for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	                args[_key - 2] = arguments[_key];
	            }

	            return new (Function.prototype.bind.apply(Service, [null].concat(args, [injector])))();
	        }
	    }, {
	        key: 'function',
	        value: function _function(injector, service) {
	            for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	                args[_key2 - 2] = arguments[_key2];
	            }

	            return service.apply(undefined, args.concat([injector]));
	        }
	    }, {
	        key: 'static',
	        value: function _static(injector, instance) {
	            return instance;
	        }
	    }]);

	    return ParamListAppender;
	}();

	exports.default = ParamListAppender;

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ParamListPrepender = function () {
	    function ParamListPrepender() {
	        _classCallCheck(this, ParamListPrepender);
	    }

	    _createClass(ParamListPrepender, [{
	        key: 'factory',
	        value: function factory(injector, Service) {
	            for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	                args[_key - 2] = arguments[_key];
	            }

	            return new (Function.prototype.bind.apply(Service, [null].concat([injector], args)))();
	        }
	    }, {
	        key: 'function',
	        value: function _function(injector, service) {
	            for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	                args[_key2 - 2] = arguments[_key2];
	            }

	            return service.apply(undefined, [injector].concat(args));
	        }
	    }, {
	        key: 'autoInjectedFactory',
	        value: function autoInjectedFactory(injector, Service, ServiceName) {
	            var Surrogate = function (_Service) {
	                _inherits(Surrogate, _Service);

	                function Surrogate() {
	                    var _ref;

	                    _classCallCheck(this, Surrogate);

	                    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	                        args[_key3] = arguments[_key3];
	                    }

	                    return _possibleConstructorReturn(this, (_ref = Surrogate.__proto__ || Object.getPrototypeOf(Surrogate)).call.apply(_ref, [this, injector].concat(args)));
	                }

	                _createClass(Surrogate, null, [{
	                    key: '__origin__',
	                    get: function get() {
	                        return ServiceName;
	                    }
	                }]);

	                return Surrogate;
	            }(Service);

	            return Surrogate;
	        }
	    }, {
	        key: 'autoInjectedFunction',
	        value: function autoInjectedFunction(injector, service, serviceName) {
	            var Surrogate = function Surrogate() {
	                for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
	                    args[_key4] = arguments[_key4];
	                }

	                return service.call.apply(service, [this, injector].concat(args));
	            };
	            Surrogate.__origin__ = serviceName;
	            return Surrogate;
	        }
	    }, {
	        key: 'static',
	        value: function _static(injector, instance) {
	            return instance;
	        }
	    }, {
	        key: 'autoInjectedStatic',
	        value: function autoInjectedStatic() {
	            return this.static.apply(this, arguments);
	        }
	    }]);

	    return ParamListPrepender;
	}();

	exports.default = ParamListPrepender;

/***/ }
/******/ ])
});
;