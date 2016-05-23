'use strict';

import { default as ParamListPrepender } from '../../../lib/resolvers/ParamListPrepender.js';

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

            describe('Function declarations', function () {

                it('should make possible to access the injector from the constructor', function() {

                    const start = function() {
                        appInstance = paramListPrepender.factory(injector, AppFuncDecl, 'param1');
                    };

                    expect(start).to.not.throw();
                });

                it('should create an instance of given class with the passed parameters', function() {

                    appInstance = paramListPrepender.factory(injector, AppFuncDecl, 'param1', 'param2');

                    expect(appInstance.param1).to.be.equal('param1');
                    expect(appInstance.param2).to.be.equal('param2');
                });
            });

            describe('Class declarations', function () {

                it('should make possible to access the injector from the constructor', function() {

                    const start = function() {
                        appInstance = paramListPrepender.factory(injector, AppClassDecl, 'param1');
                    };

                    expect(start).to.not.throw();
                });

                it('should create an instance of given class with the passed parameters', function() {

                    appInstance = paramListPrepender.factory(injector, AppClassDecl, 'param1', 'param2');

                    expect(appInstance.param1).to.be.equal('param1');
                    expect(appInstance.param2).to.be.equal('param2');
                });
            });
        });

        describe.only('factoryProvider', function () {

            it('should work well for function declarations', function() {

                const start = function() {
                    let AppFuncDeclSurrogate = paramListPrepender.factoryProvider(injector, 'AppFuncDecl', AppFuncDecl);
                    appInstance = new AppFuncDeclSurrogate('param1', 'param2');
                };

                expect(start).to.not.throw();
                expect(appInstance.param1).to.be.equal('param1');
                expect(appInstance.param2).to.be.equal('param2');
                expect(appInstance.testMethod()).to.be.equal(42);
            });

            it('should work well for class declarations', function() {

                const start = function() {
                    let AppClassDeclSurrogate = paramListPrepender.factoryProvider(injector, 'AppClassDecl', AppClassDecl);
                    appInstance = new AppClassDeclSurrogate('param1', 'param2');
                };

                expect(start).to.not.throw();
                expect(appInstance.param1).to.be.equal('param1');
                expect(appInstance.param2).to.be.equal('param2');
                expect(appInstance.testMethod()).to.be.equal(42);
            });
        });
    });

    describe('Function', function () {

        const testFunction = function(injector, a, b) {
            injector.resolve('Whatever');
            return a + b;
        };

        it('should call the passed function with injecting the injector as first parameter', function() {

            let result = null;
            const start = function() {
                result = paramListPrepender.function(injector, testFunction, 3, 4);
            };

            expect(start).to.not.throw();
            expect(result).to.be.equal(7);
        });
    });

    describe('Static', function () {

        it('should simply return the instance object', function() {

            const testInstance = {};

            let result = paramListPrepender.static(injector, testInstance);

            expect(result).to.be.equal(testInstance);
        });
    });
});
