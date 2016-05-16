'use strict';

const Container = require('../../lib/Container.js');

class TestClass {
    constructor (injector, str, func, obj) {
        this.str = str;
        this.func = func;
        this.obj = obj;
    }
}

class TestClass2 {

}

describe('Injector container', function (){

    describe('register', function() {

        it('should not overwrite an already registered service', function() {

            const injector = new Container();

            injector.register('TestClass', TestClass);
            try {
                injector.register('TestClass', TestClass2);
            }
            catch(e) {
                expect(injector.resolve('TestClass')).to.be.an.instanceOf(TestClass);
            }
        });

        it('should throw an Error if the dependency to be registered is already registered', function() {

            const injector = new Container();
            injector.register('SupaDupaTestClass', TestClass);

            const testFunc = function() {
                injector.register('SupaDupaTestClass', TestClass2);
            };

            expect(testFunc).to.throw(Error, 'Dependency is already registered: SupaDupaTestClass -> TestClass');
        });
    });

    describe('resolve', function() {

        it('should throw an Error if the dependency to be resolved is not registered', function() {

            const injector = new Container();

            const testFunc = function() {
                injector.resolve('test');
            };

            expect(testFunc).to.throw(Error, 'Dependency not found: test');
        });

        it('should resolve the registered service', function() {

            const injector = new Container();

            injector.register('TestClass', TestClass);

            expect(injector.resolve('TestClass')).to.be.an.instanceOf(TestClass);
        });

        it('should resolve the registered service with additional arguments', function() {

            const expectedStr = 'Diva Plavalaguna 5X',
                expectedFunc = function() { return 'Multipass!'; },
                expectedObj = {
                    color: 'super-green'
                },
                injector = new Container();

            injector.register('TestClass', TestClass);

            const instance = injector.resolve('TestClass', expectedStr, expectedFunc, expectedObj);
            expect(instance.str).to.be.equal(expectedStr);
            expect(instance.func).to.be.equal(expectedFunc);
            expect(instance.obj).to.be.equal(expectedObj);
        });

        it('should inject the service locator container into the resolved object\'s constructor', function() {

            class App {
                constructor(injector) {
                    injector.resolve('TestClass');
                }
            }

            const injector = new Container();
            injector.register('TestClass', TestClass);
            injector.register('App', App);

            const app = injector.resolve('App');
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

            const injector = new Container();
            injector.register('App', App);
            injector.register('Level1', Level1);
            injector.register('TestClass', TestClass);

            const app = injector.resolve('App');

            expect(app.level1.test).to.be.instanceOf(TestClass2);
        });

        it('should try to resolve in parent\'s container if not presen in the current one', function() {

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

            const injector = new Container();
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

            const injector = new Container();
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

            const injector = new Container();
            injector.register('App', App);

            const app = injector.resolve('App');

            const setNamespace = function() {
                app.injector.namespace = 'Modified'
            };

            expect(setNamespace).to.throw();
            expect(app.injector.namespace).to.be.equal('');
        });
    });
});