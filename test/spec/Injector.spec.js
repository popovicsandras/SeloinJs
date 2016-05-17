'use strict';

const Injector = require('../../lib/Injector.js');

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

        describe('namespace', function () {

            it('should create injector with "Composition Root" namespace by default', function () {

                const injector = new Injector();

                expect(injector.namespace).to.be.equal('Composition Root');
            });

            it('should create injector with passed parameter as namespace if given', function () {

                const injector = new Injector({name: 'Planet Namek'});

                expect(injector.namespace).to.be.equal('Planet Namek');
            });

            it('should create the namespace property as a readonly property', function () {
                const injector = new Injector();

                function setNamespace() { injector.namespace = 'Modified'; }

                expect(setNamespace).to.throw();
                expect(injector.namespace).to.be.equal('Composition Root');
            });
        });

        describe('parent', function () {

            it('should create injector with null namespace by default', function () {

                const injector = new Injector();

                expect(injector.__parent).to.be.null;
            });

            it('should create injector with passed parameter as parent if given', function () {

                const parentContainer = {},
                    injector = new Injector({
                        name: 'Planet Namek',
                        parent: parentContainer
                    });

                expect(injector.__parent).to.be.equal(parentContainer);
            });

            it('should create the __parent property as a readonly property', function () {
                const parentContainer = {},
                    injector = new Injector({
                        name: 'Planet Namek',
                        parent: parentContainer
                    });

                function setParent() { injector.__parent = {}; }

                expect(setParent).to.throw();
                expect(injector.__parent).to.be.equal(parentContainer);
            });
        });
    });

    describe('register', function() {

        it('should not overwrite an already registered service', function() {

            const injector = new Injector();

            injector.register('TestClass', TestClass);
            try {
                injector.register('TestClass', TestClass2);
            }
            catch(e) {
                expect(injector.resolve('TestClass')).to.be.an.instanceOf(TestClass);
            }
        });

        it('should throw an Error if the dependency to be registered is already registered', function() {

            const injector = new Injector();
            injector.register('SupaDupaTestClass', TestClass);

            const testFunc = function() {
                injector.register('SupaDupaTestClass', TestClass2);
            };

            expect(testFunc).to.throw(Error, 'Dependency is already registered: SupaDupaTestClass -> TestClass');
        });
    });

    describe('resolve', function() {

        describe('a service (as factory)', function () {

            it('should throw an Error if the dependency to be resolved is not registered', function() {

                const injector = new Injector();

                const testFunc = function() {
                    injector.resolve('test');
                };

                expect(testFunc).to.throw(Error, 'Dependency not found: test');
            });

            it('should resolve the registered service', function() {

                const injector = new Injector();

                injector.register('TestClass', TestClass);

                expect(injector.resolve('TestClass')).to.be.an.instanceOf(TestClass);
            });

            it('should resolve the registered service with additional arguments', function() {

                const expectedStr = 'Diva Plavalaguna 5X',
                    expectedFunc = function() { return 'Multipass!'; },
                    expectedObj = {
                        color: 'super-green'
                    },
                    injector = new Injector();

                injector.register('TestClass', TestClass);

                const instance = injector.resolve('TestClass', expectedStr, expectedFunc, expectedObj);
                expect(instance.str).to.be.equal(expectedStr);
                expect(instance.func).to.be.equal(expectedFunc);
                expect(instance.obj).to.be.equal(expectedObj);
            });
        });

        describe('an instance (as singleton)', function () {

            it('should resolve the registered instance', function () {
                const Cache = {cache: 'whatever'},
                    injector = new Injector();

                injector.register('Cache', Cache);

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
                injector.register('TestClass', TestClass);
                injector.register('App', App);

                const start = function() {
                    injector.resolve('App');
                };

                expect(start).to.not.throw();
            });
        });

        describe('Constructor parameter appending', function () {

            var injector,
                ConstructorAppender;

            before(function() {
                ConstructorAppender = require('../../lib/injection-strategies/ConstructorAppender.js');
            });

            beforeEach(function() {
                injector = new Injector({
                    injectMethod: ConstructorAppender
                });
                injector.register('TestClass', TestClass);
            });

            it('should inject the injector to the end of constructor\'s parameter list', function() {

                class App {
                    constructor(param1, param2) {
                        const injector = arguments[arguments.length - 1];
                        injector.resolve('TestClass');
                    }
                }

                injector.register('App', App);

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

                injector.register('App', App);

                const start = function() {
                    injector.resolve('App');
                };

                expect(start).to.not.throw();
            });
        });
    });

    describe('createNamespace', function() {

        it('should create a new level in injector chain', function() {

            class App {
                constructor(injector) {
                    this.level1 = injector.resolve('Level1');
                }
            }

            class Level1 {
                constructor(rootInjector) {
                    const injector = rootInjector.createNamespace();
                    injector.register('TestClass', TestClass2);

                    this.test = injector.resolve('TestClass');
                }
            }

            const injector = new Injector();
            injector.register('App', App);
            injector.register('Level1', Level1);
            injector.register('TestClass', TestClass);

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
                    const injector = rootInjector.createNamespace();
                    injector.register('ServiceFromLevel1', TestClass2);
                    this.level2 = injector.resolve('Level2');
                }
            }

            class Level2 {
                constructor(rootInjector) {
                    const injector = rootInjector.createNamespace();
                    this.test = injector.resolve('TestClass');
                    this.test2 = injector.resolve('ServiceFromLevel1');
                }
            }

            const injector = new Injector();
            injector.register('App', App);
            injector.register('Level1', Level1);
            injector.register('Level2', Level2);
            injector.register('TestClass', TestClass);

            const app = injector.resolve('App');

            expect(app.level1.level2.test).to.be.instanceOf(TestClass);
            expect(app.level1.level2.test2).to.be.instanceOf(TestClass2);
        });

        it('should set namespace if specified in parameter', function() {

            class App {
                constructor(rootInjector) {
                    this.injector = rootInjector.createNamespace();
                    this.level1 = this.injector.resolve('Level1');
                }
            }

            class Level1 {
                constructor(rootInjector) {
                    this.injector = rootInjector.createNamespace('Composition Level 1');
                }
            }

            const injector = new Injector();
            injector.register('App', App);
            injector.register('Level1', Level1);
            injector.register('TestClass', TestClass);

            const app = injector.resolve('App');

            expect(injector.namespace).to.be.equal('Composition Root');
            expect(app.injector.namespace).to.be.equal('');
            expect(app.level1.injector.namespace).to.be.equal('Composition Level 1');
        });

        it('should set namespace as a readonly property', function() {

            class App {
                constructor(rootInjector) {
                    this.injector = rootInjector.createNamespace();
                }
            }

            const injector = new Injector();
            injector.register('App', App);

            const app = injector.resolve('App');

            const setNamespace = function() {
                app.injector.namespace = 'Modified'
            };

            expect(setNamespace).to.throw();
            expect(app.injector.namespace).to.be.equal('');
        });

        it('should set __parent as a readonly property', function() {

            class App {
                constructor(rootInjector) {
                    this.injector = rootInjector.createNamespace();
                }
            }

            const injector = new Injector();
            injector.register('App', App);

            const app = injector.resolve('App');

            const setParent = function() {
                app.injector.__parent = {}
            };

            expect(setParent).to.throw();
        });

        it('should set the loader to be the same as the parent\'s one', function() {

            class App {
                constructor(rootInjector) {
                    this.injector = rootInjector.createNamespace();
                }
            }

            const loader = { load: function() {} },
                injector = new Injector({ loader: loader });

            injector.register('App', App);

            const app = injector.resolve('App');

            expect(app.injector.loader).to.be.equal(loader);
        });
    });

    describe('reset', function() {

        it('should reset the container\'s registered providers', function () {
            const injector = new Injector();
            injector.register('test', TestClass);
            const testFunc = function () { injector.resolve('test'); };

            injector.reset();

            expect(testFunc).to.throw(Error, 'Dependency not found: test');
        });
    });

    describe('load', function () {

        var jsonLoaderMock;

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

        it('should load the appropriate config loader\'s load method', function () {

            const injector = new Injector({loader: jsonLoaderMock});

            injector.load('app-di.json');

            expect(jsonLoaderMock.load).to.have.been.calledWith('app-di.json');
        });

        it('should register all the services returned by the loader', function () {

            const injector = new Injector({loader: jsonLoaderMock});
            injector.load('app-di.json');

            const instance = injector.resolve('Factory', 'Kakarot'),
                singleton = injector.resolve('Singleton');

            expect(instance.name).to.be.equal('Factory: Kakarot');
            expect(singleton.id).to.be.equal('Singleton');
        });

        it('should use the default commonjs loader by default', function () {

            const injector = new Injector();
            injector.load(__dirname + '/../fixtures/di-config.js');

            const songoku = injector.resolve('Songoku'),
                Piccolo = injector.resolve('Piccolo');

            expect(songoku.dragonball).to.be.equal('4 star');
            expect(Piccolo.id).to.be.equal('Piccolo');
        });
    });
});