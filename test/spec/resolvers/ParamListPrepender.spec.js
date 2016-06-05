'use strict';

import { default as ParamListPrepender } from '../../../lib/Resolvers/ParamListPrepender';

describe('ParamListPrepender', function () {

    const injector = { resolve: function() {} };
    let paramListPrepender,
        appInstance;

    beforeEach(function() {
        paramListPrepender = new ParamListPrepender();
    });

    describe('Class and constructor function related', function () {

        const AppFuncDecl = function(injector, param1, param2) {
            this.param1 = param1;
            this.param2 = param2;
            injector.resolve('Whatever');
        };
        AppFuncDecl.prototype = {
            testMethod: function() {
                return 42;
            }
        };

        class AppClassDecl {
            constructor(injector, param1, param2) {
                this.param1 = param1;
                this.param2 = param2;
                injector.resolve('Whatever');
            }

            testMethod() {
                return 42;
            }
        }

        describe('factory', function () {

            given(AppFuncDecl, AppClassDecl)
                .it('should make possible to access the injector from the constructor', function(ConstructorDeclaration) {

                    const start = function() {
                        appInstance = paramListPrepender.factory(injector, ConstructorDeclaration, 'param1');
                    };

                    expect(start).to.not.throw();
                });

            given(AppFuncDecl, AppClassDecl)
                .it('should create an instance of given class with the passed parameters', function(ConstructorDeclaration) {

                    appInstance = paramListPrepender.factory(injector, ConstructorDeclaration, 'param1', 'param2');

                    expect(appInstance.param1).to.be.equal('param1');
                    expect(appInstance.param2).to.be.equal('param2');
                });
        });

        describe('autoInjectedFactory', function () {

            given(AppFuncDecl, AppClassDecl)
                .it('should return a surrogate constructor function which injects the injector as the first parameter', function(ConstructorDeclaration) {

                    const start = function() {
                        let ConstructorSurrogate = paramListPrepender.autoInjectedFactory(injector, ConstructorDeclaration);
                        appInstance = new ConstructorSurrogate();
                    };

                    expect(start).to.not.throw();
                });

            given(AppFuncDecl, AppClassDecl)
                .it('should call the original constructor function with the given parameters (after the injector)', function(ConstructorDeclaration) {

                    let ConstructorSurrogate = paramListPrepender.autoInjectedFactory(injector, ConstructorDeclaration);
                    appInstance = new ConstructorSurrogate('param1', 'param2');

                    expect(appInstance.param1).to.be.equal('param1');
                    expect(appInstance.param2).to.be.equal('param2');
                });

            given(AppFuncDecl, AppClassDecl)
                .it('should return a surrogate constructor which has a prototype that contains everything from the original one\'s', function(ConstructorDeclaration) {

                    let ConstructorSurrogate = paramListPrepender.autoInjectedFactory(injector, ConstructorDeclaration);
                    appInstance = new ConstructorSurrogate();

                    expect(appInstance.testMethod()).to.be.equal(42);
                });

            given(AppFuncDecl, AppClassDecl)
                .it('should return a surrogate constructor whose prototype is cloned from the original\'s one', function(ConstructorDeclaration) {

                    let ConstructorSurrogate = paramListPrepender.autoInjectedFactory(injector, ConstructorDeclaration);
                    appInstance = new ConstructorSurrogate();

                    expect(ConstructorSurrogate.prototype).to.be.not.equal(ConstructorDeclaration.prototype);
                    expect(ConstructorSurrogate.prototype.constructor).to.be.equal(ConstructorSurrogate);
                });

            given(  [AppFuncDecl, 'AppFuncDeclFancyName'],
                    [AppClassDecl, 'AppClassDeclFancyName'])
                .it('should set the surrogate constructor function\'s __origin__ to the original service\'s name', function(ConstructorDeclaration, ConstructorDeclarationName) {

                    let ConstructorSurrogate = paramListPrepender.autoInjectedFactory(injector, ConstructorDeclaration, ConstructorDeclarationName);

                    expect(ConstructorSurrogate.__origin__).to.be.equal(ConstructorDeclarationName);
                });
        });
    });

    describe('Function related', function () {

        const testFunction = function(injector, a, b) {
            injector.resolve('Whatever');
            return a + b;
        };

        const testFunctionWithContext = function(injector, a, b) {
            this.result = a + b;
        };

        describe('function', function () {

            it('should call the passed function with injecting the injector as first parameter', function() {

                let result = null;
                const start = function() {
                    result = paramListPrepender.function(injector, testFunction, 3, 4);
                };

                expect(start).to.not.throw();
                expect(result).to.be.equal(7);
            });
        });

        describe('autoInjectedFunction', function () {

            it('return a surrogate function which injects the injector as the first parameter', function () {

                const start = function() {
                    let surrogateFunction = paramListPrepender.autoInjectedFunction(injector, testFunction);
                    surrogateFunction(3, 4);
                };

                expect(start).to.not.throw();
            });

            it('should call the original function with the given parameters (after the injector)', function () {

                const surrogateFunction = paramListPrepender.autoInjectedFunction(injector, testFunction);
                let result = surrogateFunction(3, 4);

                expect(result).to.be.equal(7);
            });

            it('should call the original function on the same context as the surrogate function', function () {

                const testContext = {
                    result: null
                };
                const surrogateFunction = paramListPrepender.autoInjectedFunction(injector, testFunctionWithContext);
                surrogateFunction.call(testContext, 5, 6);

                expect(testContext.result).to.be.equal(11);
            });

            it('should set the surrogate function\'s __origin__ to the original function\'s name', function () {

                const surrogateFunction = paramListPrepender.autoInjectedFunction(injector, testFunction, 'testFunctionFancyName');

                expect(surrogateFunction.__origin__).to.be.equal('testFunctionFancyName');
            });
        });
    });

    describe('Static related', function () {

        it('should simply return the instance object in case of static', function() {

            const testInstance = {};

            let result = paramListPrepender.static(injector, testInstance);

            expect(result).to.be.equal(testInstance);
        });

        it('should simply return the instance object in case of autoInjectedStatic', function() {

            const testInstance = {};

            let result = paramListPrepender.autoInjectedStatic(injector, testInstance);

            expect(result).to.be.equal(testInstance);
        });
    });
});
