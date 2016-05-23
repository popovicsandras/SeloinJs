'use strict';

import {Injector, Resolvers} from '../../lib/package';

class TestClass {
    constructor (injector, str, func, obj) {
        this.str = str;
        this.func = func;
        this.obj = obj;
    }
}

class TestClass2 {}

describe('Injector container', function (){

    describe('constructor', function () {

        describe('scope', function () {

            it('should create injector with "root" scope (name) by default', function () {

                const injector = new Injector();

                expect(injector.scope).to.be.equal('root');
            });

            it('should create injector with passed parameter as scope (name) if given', function () {

                const injector = new Injector({scope: 'Planet Namek'});

                expect(injector.scope).to.be.equal('Planet Namek');
            });

            it('should create the scope property as a readonly property', function () {
                const injector = new Injector();

                function setScope() { injector.scope = 'Modified'; }

                expect(setScope).to.throw();
                expect(injector.scope).to.be.equal('root');
            });
        });

        describe('parent', function () {

            it('should create injector with null parent by default', function () {

                const injector = new Injector();

                expect(injector.parent).to.be.null;
            });

            it('should create injector with passed parameter as parent if given', function () {

                const parentContainer = {},
                    injector = new Injector({
                        scope: 'Planet Namek',
                        parent: parentContainer
                    });

                expect(injector.parent).to.be.equal(parentContainer);
            });

            it('should create the parent property as a readonly property', function () {
                const parentContainer = {},
                    injector = new Injector({
                        scope: 'Planet Namek',
                        parent: parentContainer
                    });

                function setParent() { injector.parent = {}; }

                expect(setParent).to.throw();
                expect(injector.parent).to.be.equal(parentContainer);
            });
        });
    });

    describe('registering and resolving', function() {

        it('should not overwrite an already registered service', function() {

            const injector = new Injector();

            injector.factory('TestClass', TestClass);
            try {
                injector.factory('TestClass', TestClass2);
            }
            catch(e) {
                expect(injector.resolve('TestClass')).to.be.an.instanceOf(TestClass);
            }
        });

        it('should throw an Error if the dependency to be registered is already registered', function() {

            const injector = new Injector();
            injector.factory('SupaDupaTestClass', TestClass);

            const testFunc = function() {
                injector.function('SupaDupaTestClass', TestClass2);
            };

            expect(testFunc).to.throw(Error, 'Dependency is already registered: SupaDupaTestClass');
        });

        it('should throw an Error if the dependency to be resolved is not registered', function() {

            const injector = new Injector();

            const testFunc = function() {
                injector.resolve('test');
            };

            expect(testFunc).to.throw(Error, 'Dependency not found: test');
        });

        describe('an instance (as factory)', function () {

            it('should resolve by creating a new instance of given function', function() {

                const injector = new Injector();

                injector.factory('TestClass', TestClass);

                expect(injector.resolve('TestClass')).to.be.an.instanceOf(TestClass);
            });

            it('should resolve the registered service with additional arguments', function() {

                const expectedStr = 'Diva Plavalaguna 5X',
                    expectedFunc = function() { return 'Multipass!'; },
                    expectedObj = {
                        color: 'super-green'
                    },
                    injector = new Injector();

                injector.factory('TestClass', TestClass);

                const instance = injector.resolve('TestClass', expectedStr, expectedFunc, expectedObj);
                expect(instance.str).to.be.equal(expectedStr);
                expect(instance.func).to.be.equal(expectedFunc);
                expect(instance.obj).to.be.equal(expectedObj);
            });
        });

        describe('a function (as function)', function () {

            it('should resolve by simply invoking given function', function() {

                const testFunction = sinon.spy();
                const injector = new Injector();

                injector.function('TestFunction', testFunction);
                injector.resolve('TestFunction', 1, 2, 3);

                expect(testFunction).to.have.been.called;
            });

            it('should resolve by simply invoking given function with given parameters', function() {

                const testFunction = function (injector, a, b, c) {
                    return a + b + c;
                };
                const injector = new Injector();

                injector.function('TestFunction', testFunction);
                const sum = injector.resolve('TestFunction', 1, 2, 3);

                expect(sum).to.be.equal(6);
            });
        });

        describe('an instance (as static)', function () {

            it('should resolve the registered instance', function () {
                const Cache = {cache: 'whatever'},
                    injector = new Injector();

                injector.static('Cache', Cache);

                expect(injector.resolve('Cache')).to.be.equal(Cache);
            });
        });

        describe('a config object (as config)', function () {

            it('should resolve the registered instance on root', function () {
                const configObject = {},
                    injector = new Injector();

                injector.config(configObject);

                expect(injector.resolve('config:root')).to.be.equal(configObject);
            });

            it('should resolve the registered instance on child scope', function () {
                const configObject = {},
                    injector = new Injector();

                const childScope = injector.createChild('child-scope');
                childScope.config(configObject);

                expect(childScope.resolve('config:child-scope')).to.be.equal(configObject);
            });
        });

        describe('a config object on a named scope (as configScope)', function () {

            it('should resolve the registered named config instance', function () {

                const configObject = {},
                    injector = new Injector();

                injector.configScope('my-supa-dupa-scope', configObject);

                expect(injector.resolve('config:my-supa-dupa-scope')).to.be.equal(configObject);
            });
        });
    });

    describe('createChild', function() {

        it('should throw an error if createChild has no scope name', function() {

            const injector = new Injector();

            const createChild = function() {
                injector.createChild({});
            };
            const createChildSimple = function() {
                injector.createChild();
            };


            expect(createChild).to.throw(`Scope name can't be empty`);
            expect(createChildSimple).to.throw(`Scope name can't be empty`);
        });

        it('should throw an error if createChild\'s scope name is empty string', function() {

            const injector = new Injector();

            const createChild = function() {
                injector.createChild({scope: ''});
            };
            const createChildSimple = function() {
                injector.createChild('');
            };

            expect(createChild).to.throw(`Scope name can't be empty`);
            expect(createChildSimple).to.throw(`Scope name can't be empty`);
        });

        it('should set the scope name of child scope to the given parameter', function () {

            let childScopeFromObject,
                childScopeSimple;

            const injector = new Injector();

            childScopeFromObject = injector.createChild({scope: 'scope-name-from-options-object'});
            childScopeSimple = injector.createChild('scope-name-from-string');

            expect(childScopeFromObject.scope).to.be.equal('scope-name-from-options-object');
            expect(childScopeSimple.scope).to.be.equal('scope-name-from-string');
        });

        it('should use the parent\'s resolver by default', function () {

            const injector = new Injector();

            const childScopeSimple = injector.createChild({
                scope: 'scope-name-from-string'
            });

            expect(childScopeSimple.resolver).to.be.equal(injector.resolver);
        });

        it('should set the passed resolver for the new child scope', function () {

            const injector = new Injector();
            const resolver = new Resolvers.ParamListAppender();

            const childScopeFromObject = injector.createChild({
                scope: 'scope-name-from-options-object',
                resolver: resolver
            });

            expect(childScopeFromObject.resolver).to.be.not.equal(injector.resolver);
            expect(childScopeFromObject.resolver).to.be.equal(resolver);
        });

        it('should use the passed resolver for the new child scope', function () {

            class TestForOverriddenResolver {
                constructor(param1, injector) {
                    injector.resolve('TestClass');
                    this.param1 = param1;
                }
            }

            let test;
            const injector = new Injector();
            injector.factory('TestForOverriddenResolver', TestForOverriddenResolver);
            injector.factory('TestClass', TestClass);
            const childScopeFromObject = injector.createChild({
                scope: 'whatever',
                resolver: new Resolvers.ParamListAppender()
            });

            function testResolve() {
                test = childScopeFromObject.resolve('TestForOverriddenResolver', 'param1');
            }

            expect(testResolve).to.not.throw();
            expect(test.param1).to.be.equal('param1');
        });

        it('should create a new level in injector chain', function() {

            class App {
                constructor(injector) {
                    this.level1 = injector.resolve('Level1');
                }
            }

            class Level1 {
                constructor(rootInjector) {
                    const injector = rootInjector.createChild('level2');
                    injector.factory('TestClass', TestClass2);

                    this.test = injector.resolve('TestClass');
                }
            }

            const injector = new Injector();
            injector.factory('App', App);
            injector.factory('Level1', Level1);
            injector.factory('TestClass', TestClass);

            const app = injector.resolve('App');

            expect(app.level1.test).to.be.instanceOf(TestClass2);
        });

        it('should try to resolve in parent\'s container if service is not present in the current one', function() {

            class App {
                constructor(injector) {
                    this.level1 = injector.resolve('Level1');
                }
            }

            class Level1 {
                constructor(rootInjector) {
                    const injector = rootInjector.createChild('whatever');
                    injector.factory('ServiceFromLevel1', TestClass2);
                    this.level2 = injector.resolve('Level2');
                }
            }

            class Level2 {
                constructor(rootInjector) {
                    const injector = rootInjector.createChild('whatever2');
                    this.test = injector.resolve('TestClass');
                    this.test2 = injector.resolve('ServiceFromLevel1');
                }
            }

            const injector = new Injector();
            injector.factory('App', App);
            injector.factory('Level1', Level1);
            injector.factory('Level2', Level2);
            injector.factory('TestClass', TestClass);

            const app = injector.resolve('App');

            expect(app.level1.level2.test).to.be.instanceOf(TestClass);
            expect(app.level1.level2.test2).to.be.instanceOf(TestClass2);
        });

        it('should set scope if specified in parameter', function() {

            class App {
                constructor(rootInjector) {
                    this.injector = rootInjector.createChild('level1');
                    this.level1 = this.injector.resolve('Level1');
                }
            }

            class Level1 {
                constructor(rootInjector) {
                    this.injector = rootInjector.createChild('level2');
                }
            }

            const injector = new Injector();
            injector.factory('App', App);
            injector.factory('Level1', Level1);
            injector.factory('TestClass', TestClass);

            const app = injector.resolve('App');

            expect(injector.scope).to.be.equal('root');
            expect(app.injector.scope).to.be.equal('level1');
            expect(app.level1.injector.scope).to.be.equal('level2');
        });

        it('should set scope as a readonly property', function() {

            class App {
                constructor(rootInjector) {
                    this.injector = rootInjector.createChild('original');
                }
            }

            const injector = new Injector();
            injector.factory('App', App);

            const app = injector.resolve('App');

            const setScope = function() {
                app.injector.scope = 'modified'
            };

            expect(setScope).to.throw();
            expect(app.injector.scope).to.be.equal('original');
        });

        it('should set parent as a readonly property', function() {

            class App {
                constructor(rootInjector) {
                    this.injector = rootInjector.createChild('scope1');
                }
            }

            const injector = new Injector();
            injector.factory('App', App);

            const app = injector.resolve('App');

            const setParent = function() {
                app.injector.parent = {}
            };

            expect(setParent).to.throw();
        });
    });

    describe('reset', function() {

        it('should reset the container\'s registered providers', function () {
            const injector = new Injector();
            injector.factory('test', TestClass);
            const testFunc = function () { injector.resolve('test'); };

            injector.reset();

            expect(testFunc).to.throw(Error, 'Dependency not found: test');
        });
    });

    describe('initScope', function () {

        let configObject;

        beforeEach(function() {
            configObject = {
                factory: {},
                function: {},
                static: {},
                config: {}
            };
        });

        it('should register the factories of configObject', function () {

            const injector = new Injector();
            configObject.factory = {
                'TestClass': TestClass,
                'TestClass2': TestClass2
            };
            injector.config(configObject);

            injector.initScope();

            const test = injector.resolve('TestClass'),
                test2 = injector.resolve('TestClass2');

            expect(test).to.be.an.instanceOf(TestClass);
            expect(test2).to.be.an.instanceOf(TestClass2);
        });

        it('should register the functions of configObject', function () {

            const injector = new Injector();
            configObject.function = {
                'testFn': sinon.spy(),
                'testFn2': sinon.spy()
            };
            injector.config(configObject);

            injector.initScope();

            injector.resolve('testFn');
            injector.resolve('testFn2');

            expect(configObject.function.testFn).to.have.been.called;
            expect(configObject.function.testFn2).to.have.been.called;
        });

        it('should register the statics of configObject', function () {

            const injector = new Injector();
            configObject.static = {
                'obj1': {foo: 'bar'},
                'obj2': {foo: 'baz'}
            };
            injector.config(configObject);

            injector.initScope();

            const obj1 = injector.resolve('obj1'),
                obj2 = injector.resolve('obj2');

            expect(obj1).to.be.equal(configObject.static.obj1);
            expect(obj2).to.be.equal(configObject.static.obj2);
        });

        it('should register the configs of configObject', function () {

            const injector = new Injector();
            configObject.config = {
                'scopeName1': {/* a valid config file goes here */},
                'scopeName2': {/* a valid config file goes here */}
            };
            injector.config(configObject);

            injector.initScope();

            const scopeName1Config = injector.resolve('config:scopeName1'),
                scopeName2Config = injector.resolve('config:scopeName2');

            expect(scopeName1Config).to.be.equal(configObject.config.scopeName1);
            expect(scopeName2Config).to.be.equal(configObject.config.scopeName2);
        });

        it('should do nothing if there is no configuration object registered to the current namespace', function () {

            const injector = new Injector();

            function initScope() {
                injector.initScope();
            }

            expect(initScope).to.not.throw();
            expect(injector.dependencies.size).to.be.equal(0);
        });
    });

    describe('Mini integration tests [usage example]', function () {

        describe('SimpleResolver and factory resolution', function () {

            let injector;

            beforeEach(function() {
                injector = new Injector({
                    resolver: new Resolvers.SimpleResolver()
                });
                injector.factory('TestClass', TestClass);
            });

            it('should inject the injector to the end of constructor\'s parameter list', function() {

                class App {
                    constructor(param1, param2) {
                        if (this.injector || arguments.length > 2) {
                            throw new Error('');
                        }
                    }
                }
                injector.factory('App', App);

                let app;
                function start() {
                    app = injector.resolve('App', 'param1', 'param2');
                }

                expect(start).to.not.throw();
            });
        });

        describe('ParamListPrepender and static resolution', function () {

            it('should resolve the static instance', function() {

                const testObj = {foo: 'bar'};
                const injector = new Injector();
                injector.static('mySupaInstance', testObj);

                const result = injector.resolve('mySupaInstance');
                expect(result).to.be.equal(testObj);
            });
        });

        describe('ParamListPrepender and function resolution', function () {

            const testFunction = function(injector, str, obj) {
                return {
                    injector: injector,
                    str: str,
                    obj: obj
                }
            };

            it('should resolve the function with injecting the injector as first parameter', function() {

                const dummyStr = 'testString',
                    dummyObj = {foo: 'bar'};

                const injector = new Injector();
                injector.function('testFunction', testFunction);

                const result = injector.resolve('testFunction', dummyStr, dummyObj);
                expect(result.str).to.be.equal(dummyStr);
                expect(result.obj).to.be.equal(dummyObj);
            });
        });

        describe('ParamListAppender and factory resolution', function () {

            let injector;

            beforeEach(function() {
                injector = new Injector({
                    resolver: new Resolvers.ParamListAppender()
                });
                injector.factory('TestClass', TestClass);
            });

            it('should inject the injector to the end of constructor\'s parameter list', function() {

                class App {
                    constructor() {
                        const injector = arguments[arguments.length - 1];
                        this.test = injector.resolve('TestClass');
                    }
                }
                injector.factory('App', App);

                const app = injector.resolve('App');

                expect(app.test).to.be.an.instanceOf(TestClass);
            });
        });

        describe('PrototypePoisoner with overridden name', function () {

            let services;

            beforeEach(function() {
                services = new Injector({
                    resolver: new Resolvers.PrototypePoisoner('services')
                });
            });

            it('should work properly in case of extended classes too', function() {

                let appInstance = null;
                class Base {}
                class App extends Base {
                    constructor() {
                        super();
                        this.services.resolve('TestClass');
                        this.services.resolve('TestClass2');
                    }
                }
                class TestClass {}
                class TestClass2 {}

                services.factory('App', App);
                services.factory('TestClass', TestClass);
                services.factory('TestClass2', TestClass2);

                const start = function() {
                    appInstance = services.resolve('App');
                };

                expect(start).to.not.throw();
                expect(appInstance.services).to.be.equal(services);
                expect(App.prototype.services).to.be.undefined;
            });
        });

        describe('creating child scope with overridden resolver', function () {

            it('should work fine', function () {

                class App {
                    constructor(injector, param1) {
                        const reusableComponentScope = injector.createChild({
                            scope: 'reusable-component',
                            resolver: new Resolvers.ParamListAppender()
                        });
                        this.reusableComponent = reusableComponentScope.resolve('ReusableComponent', param1);
                    }
                }

                class ReusableComponent {
                    constructor(param1) {
                        const injector = arguments[arguments.length-1];
                        injector.initScope();
                        this.dependency = injector.resolve('ReusableComponentsDependencyFactory');
                        this.appWideGlobalInstance = injector.resolve('AppWideGlobalInstance');
                        this.param1 = param1;
                        injector.resolve('ReusableComponentsDependencyFunction');
                    }
                }

                const reusableComponentConfig = {
                    factory: {
                        'ReusableComponentsDependencyFactory': TestClass
                    },
                    function: {
                        ReusableComponentsDependencyFunction: sinon.spy()
                    }
                };
                const appConfig = {
                    factory: {
                        'App': App,
                        'ReusableComponent': ReusableComponent
                    },
                    static: {
                        'AppWideGlobalInstance': {}
                    },
                    config: {
                        'reusable-component': reusableComponentConfig
                    }
                };

                let app;
                const injector = new Injector();
                injector.config(appConfig);
                injector.initScope();

                function start() {
                    app = injector.resolve('App', 'test param');
                }

                expect(start).to.not.throw();
                expect(app.reusableComponent.dependency).to.be.an.instanceOf(TestClass);
                expect(app.reusableComponent.appWideGlobalInstance).to.be.equal(appConfig.static.AppWideGlobalInstance);
                expect(app.reusableComponent.param1).to.be.equal('test param');
                expect(reusableComponentConfig.function.ReusableComponentsDependencyFunction).to.have.been.called;
            });
        });
    });
});
