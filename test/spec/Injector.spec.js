'use strict';

import Injector from '../../lib/Injector.js';
import constructorAppender from '../../lib/injection-strategies/ConstructorAppender.js';
import prototypePoisoner from '../../lib/injection-strategies/PrototypePoisoner.js';

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

            it('should create injector with null __parent by default', function () {

                const injector = new Injector();

                expect(injector.__parent).to.be.null;
            });

            it('should create injector with passed parameter as __parent if given', function () {

                const parentContainer = {},
                    injector = new Injector({
                        scope: 'Planet Namek',
                        parent: parentContainer
                    });

                expect(injector.__parent).to.be.equal(parentContainer);
            });

            it('should create the __parent property as a readonly property', function () {
                const parentContainer = {},
                    injector = new Injector({
                        scope: 'Planet Namek',
                        parent: parentContainer
                    });

                function setParent() { injector.__parent = {}; }

                expect(setParent).to.throw();
                expect(injector.__parent).to.be.equal(parentContainer);
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

                const testFunction = function (a, b, c) {
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
    });


    describe('injector injection', function () {

        describe('Constructor parameter prepending', function () {

            it('should be used by default', function() {

                class App {
                    constructor(injector) {
                        injector.resolve('TestClass');
                    }
                }

                const injector = new Injector();
                injector.factory('TestClass', TestClass);
                injector.factory('App', App);

                const start = function() {
                    injector.resolve('App');
                };

                expect(start).to.not.throw();
            });
        });

        describe('Constructor parameter appending', function () {

            let injector;

            beforeEach(function() {
                injector = new Injector({
                    injectMethod: constructorAppender
                });
                injector.factory('TestClass', TestClass);
            });

            it('should inject the injector to the end of constructor\'s parameter list', function() {

                class App {
                    constructor(param1, param2) {
                        const injector = arguments[arguments.length - 1];
                        injector.resolve('TestClass');
                    }
                }

                injector.factory('App', App);

                const start = function() {
                    injector.resolve('App', 'first param', 'second param');
                };

                expect(start).to.not.throw();
            });

            it('should inject the injector to the end of constructor\'s parameter list even if there are optional parameters', function() {

                class App {
                    constructor(optional1 = null, optional2 = '') {
                        const injector = arguments[arguments.length - 1];
                        injector.resolve('TestClass');
                    }
                }

                injector.factory('App', App);

                const start = function() {
                    injector.resolve('App');
                };

                expect(start).to.not.throw();
            });
        });

        describe('Prototype poisoning', function () {

            let injector;

            beforeEach(function() {
                injector = new Injector({
                    injectMethod: prototypePoisoner
                });
            });

            it('should work properly in case of extended classes too', function() {

                let appInstance = null;
                class Base {}
                class App extends Base {
                    constructor() {
                        super();
                        this.injector.resolve('TestClass');
                        this.injector.resolve('TestClass2');
                    }
                }
                class TestClass {}
                class TestClass2 {}

                injector.factory('App', App);
                injector.factory('TestClass', TestClass);
                injector.factory('TestClass2', TestClass2);

                const start = function() {
                    appInstance = injector.resolve('App');
                };

                expect(start).to.not.throw();
                expect(appInstance.injector).to.be.equal(injector);
                expect(App.prototype.injector).to.be.undefined;
            });
        });
    });

    describe('createChild', function() {

        it('should throw an error if createChild has no scope', function() {

            const injector = new Injector();

            const createChild = function() {
                injector.createChild();
            };

            expect(createChild).to.throw(`Scope can't be empty`);
        });

        it('should throw an error if createChild is empty string', function() {

            const injector = new Injector();

            const createChild = function() {
                injector.createChild('');
            };

            expect(createChild).to.throw(`Scope can't be empty`);
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

        it('should set __parent as a readonly property', function() {

            class App {
                constructor(rootInjector) {
                    this.injector = rootInjector.createChild('scope1');
                }
            }

            const injector = new Injector();
            injector.factory('App', App);

            const app = injector.resolve('App');

            const setParent = function() {
                app.injector.__parent = {}
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

    describe('load', function () {

        let jsonLoaderMock;

        beforeEach(function() {
            jsonLoaderMock = {
                load: function(filename, registrator) {
                    registrator('Factory', function(injector, name) { this.name = `Factory: ${name}`; });
                    registrator('Singleton', { id: 'Singleton' });
                }
            };

            sinon.spy(jsonLoaderMock, 'load');
        });

        afterEach(function() {
            jsonLoaderMock.load.restore();
        });

        it.skip('should load the appropriate config loader\'s load method', function () {

            const injector = new Injector({loader: jsonLoaderMock});

            injector.load('app-di.json');

            expect(jsonLoaderMock.load).to.have.been.calledWith('app-di.json');
        });

        it.skip('should register all the services returned by the loader', function () {

            const injector = new Injector({loader: jsonLoaderMock});
            injector.load('app-di.json');

            const instance = injector.resolve('Factory', 'Kakarot'),
                singleton = injector.resolve('Singleton');

            expect(instance.scope).to.be.equal('Factory: Kakarot');
            expect(singleton.id).to.be.equal('Singleton');
        });
    });
});
