'use strict';

import {Container, Injectors} from '../../es6';

class TestClass {
    constructor (container, str, func, obj) {
        container.resolve('TestClass2');
        this.str = str;
        this.func = func;
        this.obj = obj;
    }
}

class TestClass2 {}

describe('Injector container', function (){

    describe('constructor', function () {

        describe('scope', function () {

            it('should create container with "root" scope (name) by default', function () {

                const container = new Container();

                expect(container.scope).to.be.equal('root');
            });

            it('should create container with passed parameter as scope (name) if given', function () {

                const container = new Container({scope: 'Planet Namek'});

                expect(container.scope).to.be.equal('Planet Namek');
            });

            it('should create the scope property as a readonly property', function () {
                const container = new Container();

                function setScope() { container.scope = 'Modified'; }

                expect(setScope).to.throw();
                expect(container.scope).to.be.equal('root');
            });
        });

        describe('parent', function () {

            it('should create container with null parent by default', function () {

                const container = new Container();

                expect(container.parent).to.be.null;
            });

            it('should create container with passed parameter as parent if given', function () {

                const parentContainer = {},
                    container = new Container({
                        scope: 'Planet Namek',
                        parent: parentContainer
                    });

                expect(container.parent).to.be.equal(parentContainer);
            });

            it('should create the parent property as a readonly property', function () {
                const parentContainer = {},
                    container = new Container({
                        scope: 'Planet Namek',
                        parent: parentContainer
                    });

                function setParent() { container.parent = {}; }

                expect(setParent).to.throw();
                expect(container.parent).to.be.equal(parentContainer);
            });
        });
    });

    describe('registering and resolving', function() {

        it('should not overwrite an already registered service', function() {

            const container = new Container({
                injector: new Injectors.ParamListPrepender()
            });

            container.factory('TestClass', TestClass);
            container.factory('TestClass2', TestClass2);
            try {
                container.factory('TestClass', TestClass2);
            }
            catch(e) {
                expect(container.resolve('TestClass')).to.be.an.instanceOf(TestClass);
            }
        });

        it('should throw an Error if the dependency to be registered is already registered', function() {

            const container = new Container();
            container.factory('SupaDupaTestClass', TestClass);

            const testFunc = function() {
                container.function('SupaDupaTestClass', TestClass2);
            };

            expect(testFunc).to.throw(Error, 'Dependency is already registered: SupaDupaTestClass');
        });

        it('should throw an Error if the dependency to be resolved is not registered', function() {

            const container = new Container();

            const testFunc = function() {
                container.resolve('test');
            };

            expect(testFunc).to.throw(Error, 'Dependency not found: test');
        });

        describe('when registered as factory', function () {

            describe('an instance', function () {

                it('should resolve by creating a new instance of given function', function() {

                    const container = new Container({
                        injector: new Injectors.ParamListPrepender()
                    });

                    container.factory('TestClass', TestClass);
                    container.factory('TestClass2', TestClass2);

                    expect(container.resolve('TestClass')).to.be.an.instanceOf(TestClass);
                });

                it('should resolve the registered service with additional arguments', function() {

                    const expectedStr = 'Diva Plavalaguna 5X',
                        expectedFunc = function() { return 'Multipass!'; },
                        expectedObj = {
                            color: 'super-green'
                        },
                        container = new Container({
                            injector: new Injectors.ParamListPrepender()
                        });

                    container.factory('TestClass', TestClass);
                    container.factory('TestClass2', TestClass2);

                    const instance = container.resolve('TestClass', expectedStr, expectedFunc, expectedObj);
                    expect(instance.str).to.be.equal(expectedStr);
                    expect(instance.func).to.be.equal(expectedFunc);
                    expect(instance.obj).to.be.equal(expectedObj);
                });
            });

            describe('a provider', function () {

                it('should resolve by returning the inherited surrogate constructor function', function() {

                    const container = new Container({
                        injector: new Injectors.ParamListPrepender()
                    });
                    container.factory('TestClass2', TestClass2);

                    const autoInjectedTestClass2 = container.resolveProvider('TestClass2');

                    expect(new autoInjectedTestClass2()).to.be.an.instanceOf(TestClass2);
                    expect(autoInjectedTestClass2.__origin__).to.be.equal('TestClass2');
                });

                it('should resolve by returning the autoInjected constructor function', function() {

                    const expectedStr = 'Diva Plavalaguna 5X',
                        expectedFunc = function() { return 'Multipass!'; },
                        expectedObj = {
                            color: 'super-green'
                        },
                        container = new Container({
                            injector: new Injectors.ParamListPrepender()
                        });

                    container.factory('TestClass', TestClass);
                    container.factory('TestClass2', TestClass2);
                    const autoInjectedTestClass = container.resolveProvider('TestClass');

                    let instance;
                    function createInstance() {
                        instance = new autoInjectedTestClass(expectedStr, expectedFunc, expectedObj);
                    }

                    expect(createInstance).to.not.throw();
                    expect(instance.str).to.be.equal(expectedStr);
                    expect(instance.func).to.be.equal(expectedFunc);
                    expect(instance.obj).to.be.equal(expectedObj);
                });
            });
        });

        describe('when registered as function', function () {

            describe('resolve the function\'s invocation result', function () {

                it('should resolve by simply invoking given function', function() {

                    const testFunction = sinon.spy();
                    const container = new Container();

                    container.function('TestFunction', testFunction);
                    container.resolve('TestFunction', 1, 2, 3);

                    expect(testFunction).to.have.been.called;
                });

                it('should resolve by simply invoking given function with given parameters', function() {

                    const testFunction = function (container, a, b, c) {
                        return a + b + c;
                    };
                    const container = new Container({
                        injector: new Injectors.ParamListPrepender()
                    });

                    container.function('TestFunction', testFunction);
                    const sum = container.resolve('TestFunction', 1, 2, 3);

                    expect(sum).to.be.equal(6);
                });
            });

            describe('resolve the function provider', function () {

                it('should have the container auto injected', function() {

                    const testFunction = function (container, a, b, c) {
                        container.resolve('TestClass2');
                        return a + b + c;
                    };

                    const container = new Container({
                        injector: new Injectors.ParamListPrepender()
                    });
                    container.function('TestFunction', testFunction);
                    container.factory('TestClass2', TestClass2);
                    const testFunctionSurrogate = container.resolveProvider('TestFunction');

                    let sum;
                    function invoke() {
                        testFunctionSurrogate();
                        sum = testFunctionSurrogate(1, 2, 3);
                    }

                    expect(invoke).to.not.throw();
                    expect(sum).to.be.equal(6);
                });
            });
        });

        describe('an instance (as static)', function () {

            it('should resolve the registered instance', function () {
                const Cache = {cache: 'whatever'},
                    container = new Container();

                container.static('Cache', Cache);

                expect(container.resolve('Cache')).to.be.equal(Cache);
            });
        });

        describe('a config object (as config)', function () {

            it('should resolve the registered instance on root', function () {
                const configObject = {},
                    container = new Container();

                container.config(configObject);

                expect(container.resolve('config:root')).to.be.equal(configObject);
            });

            it('should resolve the registered instance on child scope', function () {
                const configObject = {},
                    container = new Container();

                const childScope = container.createChild('child-scope');
                childScope.config(configObject);

                expect(childScope.resolve('config:child-scope')).to.be.equal(configObject);
            });
        });

        describe('a config object on a named scope (as configScope)', function () {

            it('should resolve the registered named config instance', function () {

                const configObject = {},
                    container = new Container();

                container.configScope('my-supa-dupa-scope', configObject);

                expect(container.resolve('config:my-supa-dupa-scope')).to.be.equal(configObject);
            });
        });
    });

    describe('createChild', function() {

        it('should throw an error if createChild has no scope name', function() {

            const container = new Container();

            const createChild = function() {
                container.createChild({});
            };
            const createChildSimple = function() {
                container.createChild();
            };


            expect(createChild).to.throw(`Scope name can't be empty`);
            expect(createChildSimple).to.throw(`Scope name can't be empty`);
        });

        it('should throw an error if createChild\'s scope name is empty string', function() {

            const container = new Container();

            const createChild = function() {
                container.createChild({scope: ''});
            };
            const createChildSimple = function() {
                container.createChild('');
            };

            expect(createChild).to.throw(`Scope name can't be empty`);
            expect(createChildSimple).to.throw(`Scope name can't be empty`);
        });

        it('should set the scope name of child scope to the given parameter', function () {

            let childScopeFromObject,
                childScopeSimple;

            const container = new Container();

            childScopeFromObject = container.createChild({scope: 'scope-name-from-options-object'});
            childScopeSimple = container.createChild('scope-name-from-string');

            expect(childScopeFromObject.scope).to.be.equal('scope-name-from-options-object');
            expect(childScopeSimple.scope).to.be.equal('scope-name-from-string');
        });

        it('should use the parent\'s injector by default', function () {

            const container = new Container();

            const childScopeSimple = container.createChild({
                scope: 'scope-name-from-string'
            });

            expect(childScopeSimple.injector).to.be.equal(container.injector);
        });

        it('should set the passed injector for the new child scope', function () {

            const container = new Container();
            const injector = new Injectors.ParamListAppender();

            const childScopeFromObject = container.createChild({
                scope: 'scope-name-from-options-object',
                injector: injector
            });

            expect(childScopeFromObject.injector).to.be.not.equal(container.injector);
            expect(childScopeFromObject.injector).to.be.equal(injector);
        });

        it('should use the passed injector for the new child scope', function () {

            class TestForOverriddenInjector {
                constructor(param1, container) {
                    container.resolve('TestClass');
                    this.param1 = param1;
                }
            }

            let test;
            const container = new Container();
            container.factory('TestForOverriddenInjector', TestForOverriddenInjector);
            container.factory('TestClass', TestClass);
            container.factory('TestClass2', TestClass2);
            const childScopeFromObject = container.createChild({
                scope: 'whatever',
                injector: new Injectors.ParamListAppender()
            });

            function testResolve() {
                test = childScopeFromObject.resolve('TestForOverriddenInjector', 'param1');
            }

            expect(testResolve).to.not.throw();
            expect(test.param1).to.be.equal('param1');
        });

        it('should create a new level in container chain', function() {

            class App {
                constructor(container) {
                    this.level1 = container.resolve('Level1');
                }
            }

            class Level1 {
                constructor(rootInjector) {
                    const container = rootInjector.createChild('level2');
                    container.factory('TestClass', TestClass2);

                    this.test = container.resolve('TestClass');
                }
            }

            const container = new Container({
                injector: new Injectors.ParamListPrepender()
            });
            container.factory('App', App);
            container.factory('Level1', Level1);
            container.factory('TestClass', TestClass);

            const app = container.resolve('App');

            expect(app.level1.test).to.be.instanceOf(TestClass2);
        });

        it('should try to resolve in parent\'s container if service is not present in the current one', function() {

            class App {
                constructor(container) {
                    this.level1 = container.resolve('Level1');
                }
            }

            class Level1 {
                constructor(rootInjector) {
                    const container = rootInjector.createChild('whatever');
                    container.factory('ServiceFromLevel1', TestClass2);
                    this.level2 = container.resolve('Level2');
                }
            }

            class Level2 {
                constructor(rootInjector) {
                    const container = rootInjector.createChild('whatever2');
                    this.test = container.resolve('TestClass');
                    this.test2 = container.resolve('ServiceFromLevel1');
                }
            }

            const container = new Container({
                injector: new Injectors.ParamListPrepender()
            });
            container.factory('App', App);
            container.factory('Level1', Level1);
            container.factory('Level2', Level2);
            container.factory('TestClass', TestClass);
            container.factory('TestClass2', TestClass2);

            const app = container.resolve('App');

            expect(app.level1.level2.test).to.be.instanceOf(TestClass);
            expect(app.level1.level2.test2).to.be.instanceOf(TestClass2);
        });

        it('should set scope if specified in parameter', function() {

            class App {
                constructor(rootInjector) {
                    this.container = rootInjector.createChild('level1');
                    this.level1 = this.container.resolve('Level1');
                }
            }

            class Level1 {
                constructor(rootInjector) {
                    this.container = rootInjector.createChild('level2');
                }
            }

            const container = new Container({
                injector: new Injectors.ParamListPrepender()
            });
            container.factory('App', App);
            container.factory('Level1', Level1);
            container.factory('TestClass', TestClass);

            const app = container.resolve('App');

            expect(container.scope).to.be.equal('root');
            expect(app.container.scope).to.be.equal('level1');
            expect(app.level1.container.scope).to.be.equal('level2');
        });

        it('should set scope as a readonly property', function() {

            class App {
                constructor(rootInjector) {
                    this.container = rootInjector.createChild('original');
                }
            }

            const container = new Container({
                injector: new Injectors.ParamListPrepender()
            });
            container.factory('App', App);

            const app = container.resolve('App');

            const setScope = function() {
                app.container.scope = 'modified'
            };

            expect(setScope).to.throw();
            expect(app.container.scope).to.be.equal('original');
        });

        it('should set parent as a readonly property', function() {

            class App {
                constructor(rootInjector) {
                    this.container = rootInjector.createChild('scope1');
                }
            }

            const container = new Container({
                injector: new Injectors.ParamListPrepender()
            });
            container.factory('App', App);

            const app = container.resolve('App');

            const setParent = function() {
                app.container.parent = {}
            };

            expect(setParent).to.throw();
        });
    });

    describe('reset', function() {

        it('should reset the container\'s registered providers', function () {
            const container = new Container();
            container.factory('test', TestClass);
            const testFunc = function () { container.resolve('test'); };

            container.reset();

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

        describe('without defaultConfigObject parameter', function () {

            it('should register the factories of scope\'s configObject', function () {

                const container = new Container({
                    injector: new Injectors.ParamListPrepender()
                });
                container.config({
                    factory: {
                        'TestClass': TestClass,
                        'TestClass2': TestClass2
                    }
                });

                container.initScope();

                expect(container.resolve('TestClass')).to.be.an.instanceOf(TestClass);
                expect(container.resolve('TestClass2')).to.be.an.instanceOf(TestClass2);
            });

            it('should register the functions of scope\'s configObject', function () {

                const container = new Container();
                configObject.function = {
                    'testFn': sinon.spy(),
                    'testFn2': sinon.spy()
                };
                container.config(configObject);

                container.initScope();

                container.resolve('testFn');
                container.resolve('testFn2');

                expect(configObject.function.testFn).to.have.been.called;
                expect(configObject.function.testFn2).to.have.been.called;
            });

            it('should register the statics of scope\'s configObject', function () {

                const container = new Container();
                configObject.static = {
                    'obj1': {foo: 'bar'},
                    'obj2': {foo: 'baz'}
                };
                container.config(configObject);

                container.initScope();

                const obj1 = container.resolve('obj1'),
                    obj2 = container.resolve('obj2');

                expect(obj1).to.be.equal(configObject.static.obj1);
                expect(obj2).to.be.equal(configObject.static.obj2);
            });

            it('should register the configs of scope\'s configObject', function () {

                const container = new Container();
                configObject.config = {
                    'scopeName1': {/* a valid config file goes here */},
                    'scopeName2': {/* a valid config file goes here */}
                };
                container.config(configObject);

                container.initScope();

                const scopeName1Config = container.resolve('config:scopeName1'),
                    scopeName2Config = container.resolve('config:scopeName2');

                expect(scopeName1Config).to.be.equal(configObject.config.scopeName1);
                expect(scopeName2Config).to.be.equal(configObject.config.scopeName2);
            });

            it('should do nothing if there is no configuration object registered to the current scope', function () {

                const container = new Container();

                function initScope() {
                    container.initScope();
                }

                expect(initScope).to.not.throw();
                expect(container.services.size).to.be.equal(0);
            });
        });

        describe('with defaultConfigObject parameter', function () {

            let defaultConfigObject;

            beforeEach(function() {
                defaultConfigObject = {
                    factory: {},
                    function: {},
                    static: {},
                    config: {}
                };
            });

            describe('factories', function () {

                class TestClassOveridden {}

                it('should register the factories of passed defaultConfigObject and "config:scopename" object with the right priority', function () {

                    const container = new Container();
                    configObject.factory = {
                        'TestClass': TestClassOveridden
                    };
                    defaultConfigObject.factory = {
                        'TestClass': TestClass,
                        'TestClass2': TestClass2
                    };

                    container.config(configObject);
                    container.initScope(defaultConfigObject);

                    expect(container.resolve('TestClass')).to.be.an.instanceOf(TestClassOveridden);
                    expect(container.resolve('TestClass2')).to.be.an.instanceOf(TestClass2);
                });

                it('should not modify either the defaultConfigObject either the configObject', function () {

                    const container = new Container();
                    configObject.factory = {
                        'TestClass': TestClassOveridden
                    };
                    defaultConfigObject.factory = {
                        'TestClass2': TestClass2
                    };

                    container.config(configObject);
                    container.initScope(defaultConfigObject);

                    expect(configObject.factory).to.be.eql({
                        'TestClass': TestClassOveridden
                    });

                    expect(defaultConfigObject.factory).to.be.eql({
                        'TestClass2': TestClass2
                    });
                });
            });

            describe('functions', function () {

                function func1() { return 1; }
                function func2() { return 2; }
                function func3() { return 3; }

                it('should register the functions of passed defaultConfigObject and "config:scopename" object with the right priority', function () {

                    const container = new Container();
                    configObject.function = {
                        'func1': func3
                    };

                    defaultConfigObject.function = {
                        'func1': func1,
                        'func2': func2
                    };

                    container.config(configObject);
                    container.initScope(defaultConfigObject);

                    expect(container.resolve('func1')).to.be.equal(3);
                    expect(container.resolve('func2')).to.be.equal(2);
                });

                it('should not modify either the defaultConfigObject either the configObject', function () {

                    const container = new Container();
                    configObject.function = {
                        'func1': func3
                    };

                    defaultConfigObject.function = {
                        'func2': func2
                    };

                    container.config(configObject);
                    container.initScope(defaultConfigObject);

                    expect(configObject.function).to.be.eql({
                        'func1': func3
                    });

                    expect(defaultConfigObject.function).to.be.eql({
                        'func2': func2
                    });
                });
            });

            describe('static & config', function () {

                const obj1 = { value: 'foo' },
                    obj2 = { value: 'bar' },
                    obj3 = { value: 'baz' };

                given(['static', ''], ['config', 'config:'])
                    .it('should register the statics|config of passed defaultConfigObject and "config:scopename" object with the right priority', function (serviceType, prefix) {

                        const container = new Container();
                        configObject[serviceType] = {
                            'obj1': obj3
                        };

                        defaultConfigObject[serviceType] = {
                            'obj1': obj1,
                            'obj2': obj2
                        };

                        container.config(configObject);
                        container.initScope(defaultConfigObject);

                        expect(container.resolve(prefix + 'obj1')).to.be.equal(obj3);
                        expect(container.resolve(prefix + 'obj2')).to.be.equal(obj2);
                    });

                given('static', 'config')
                    .it('should not modify either the defaultConfigObject either the configObject', function (serviceType) {

                        const container = new Container();
                        configObject[serviceType] = {
                            'obj1': obj3
                        };

                        defaultConfigObject[serviceType] = {
                            'obj2': obj2
                        };

                        container.config(configObject);
                        container.initScope(defaultConfigObject);

                        expect(configObject[serviceType]).to.be.eql({
                            'obj1': obj3
                        });

                        expect(defaultConfigObject[serviceType]).to.be.eql({
                            'obj2': obj2
                        });
                    });
            });
        });
    });

    describe('Mini integration tests [usage example]', function () {

        describe('NoInjection and factory resolution', function () {

            let container;

            beforeEach(function() {
                container = new Container();
                container.factory('TestClass', TestClass);
            });

            it('should inject the container to the end of constructor\'s parameter list', function() {

                class App {
                    constructor(param1, param2) {
                        if (this.container || arguments.length > 2) {
                            throw new Error('');
                        }
                    }
                }
                container.factory('App', App);

                let app;
                function start() {
                    app = container.resolve('App', 'param1', 'param2');
                }

                expect(start).to.not.throw();
            });
        });

        describe('ParamListPrepender and static resolution', function () {

            it('should resolve the static instance', function() {

                const testObj = {foo: 'bar'};
                const container = new Container();
                container.static('mySupaInstance', testObj);

                const result = container.resolve('mySupaInstance');
                expect(result).to.be.equal(testObj);
            });
        });

        describe('ParamListPrepender and function resolution', function () {

            const testFunction = function(container, str, obj) {
                return {
                    container: container,
                    str: str,
                    obj: obj
                }
            };

            it('should resolve the function with injecting the container as first parameter', function() {

                const dummyStr = 'testString',
                    dummyObj = {foo: 'bar'};

                const container = new Container({
                    injector: new Injectors.ParamListPrepender()
                });
                container.function('testFunction', testFunction);

                const result = container.resolve('testFunction', dummyStr, dummyObj);
                expect(result.str).to.be.equal(dummyStr);
                expect(result.obj).to.be.equal(dummyObj);
            });
        });

        describe('ParamListAppender and factory resolution', function () {

            let container;

            beforeEach(function() {
                container = new Container({
                    injector: new Injectors.ParamListAppender()
                });
                container.factory('TestClass', TestClass);
                container.factory('TestClass2', TestClass2);
            });

            it('should inject the container to the end of constructor\'s parameter list', function() {

                class App {
                    constructor() {
                        const container = arguments[arguments.length - 1];
                        this.test = container.resolve('TestClass');
                    }
                }
                container.factory('App', App);

                const app = container.resolve('App');

                expect(app.test).to.be.an.instanceOf(TestClass);
            });
        });

        describe('creating child scope with overridden injector', function () {

            it('should work fine', function () {

                class App {
                    constructor(container, param1) {
                        const reusableComponentScope = container.createChild({
                            scope: 'reusable-component',
                            injector: new Injectors.ParamListAppender()
                        });
                        this.reusableComponent = reusableComponentScope.resolve('ReusableComponent', param1);
                    }
                }

                class ReusableComponent {
                    constructor(param1) {
                        const container = arguments[arguments.length-1];
                        container.initScope();
                        this.dependency = container.resolve('ReusableComponentsDependencyFactory');
                        this.appWideGlobalInstance = container.resolve('AppWideGlobalInstance');
                        this.param1 = param1;
                        container.resolve('ReusableComponentsDependencyFunction');
                    }
                }

                const reusableComponentConfig = {
                    factory: {
                        'ReusableComponentsDependencyFactory': TestClass,
                        'TestClass2': TestClass2
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
                const container = new Container({
                    injector: new Injectors.ParamListPrepender()
                });
                container.config(appConfig);
                container.initScope();

                function start() {
                    app = container.resolve('App', 'test param');
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
