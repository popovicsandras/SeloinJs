'use strict';

import PrototypePoisoner from '../../../lib/resolvers/PrototypePoisoner.js';

describe('PrototypePoisoner', function () {

    const injector = { resolve: function() {} };
    let prototypePoisoner,
        appInstance;

    beforeEach(function() {
        prototypePoisoner = new PrototypePoisoner();
    });

    describe('factory', function () {

        describe('Function declarations', function () {

            const AppFuncDecl = function(param1, param2) {
                this.param1 = param1;
                this.param2 = param2;
                this.injector.resolve('TestClass');
            };
            AppFuncDecl.prototype = {
                testMethod: function() {
                    this.injector.resolve();
                }
            };

            it('should create an instance of given class with the passed parameters', function() {

                appInstance = prototypePoisoner.factory(injector, AppFuncDecl, 'param1', 'param2');

                expect(appInstance.param1).to.be.equal('param1');
                expect(appInstance.param2).to.be.equal('param2');
            });

            it('should make possible to access the injector from the constructor', function() {

                const start = function() {
                    appInstance = prototypePoisoner.factory(injector, AppFuncDecl);
                };

                expect(start).to.not.throw();
                expect(appInstance.injector).to.be.equal(injector);
            });

            it('should make possible to access the injector from the constructor with overridden name', function() {

                const AppFuncCustomNameDecl = function() {
                    this.container.resolve('TestClass');
                };
                prototypePoisoner = new PrototypePoisoner('container');

                const start = function() {
                    appInstance = prototypePoisoner.factory(injector, AppFuncCustomNameDecl);
                };

                expect(start).to.not.throw();
                expect(appInstance.container).to.be.equal(injector);
            });

            it('should left the prototype chain unchanged after the constructor invoked', function() {

                const start = function() {
                    appInstance = prototypePoisoner.factory(injector, AppFuncDecl);
                };

                expect(start).to.not.throw();
                expect(AppFuncDecl.prototype.injector).to.be.undefined;
            });

            it('should have the injector in the created instance', function() {

                appInstance = prototypePoisoner.factory(injector, AppFuncDecl);

                const testMethod = function() {
                    appInstance.testMethod();
                };

                expect(testMethod).to.not.throw();
                expect(AppFuncDecl.prototype.injector).to.be.undefined;
                expect(appInstance.injector).to.be.equal(injector);
            });
        });

        describe('Class declarations', function () {

            class AppClassDecl {
                constructor(param1, param2) {
                    this.param1 = param1;
                    this.param2 = param2;
                    this.injector.resolve('TestClass');
                }

                testMethod() {
                    this.injector.resolve();
                }
            }

            class Extended extends AppClassDecl {}

            it('should create an instance of given class with the passed parameters', function() {

                appInstance = prototypePoisoner.factory(injector, AppClassDecl, 'param1', 'param2');

                expect(appInstance.param1).to.be.equal('param1');
                expect(appInstance.param2).to.be.equal('param2');
            });

            it('should make possible to access the injector from the constructor', function() {

                const start = function() {
                    appInstance = prototypePoisoner.factory(injector, AppClassDecl);
                };

                expect(start).to.not.throw();
                expect(appInstance.injector).to.be.equal(injector);
            });

            it('should make possible to access the injector from the constructor with overridden name', function() {

                class AppClassCustomNameDecl {
                    constructor() {
                        this.container.resolve('TestClass');
                    }
                }

                prototypePoisoner = new PrototypePoisoner('container');

                const start = function() {
                    appInstance = prototypePoisoner.factory(injector, AppClassCustomNameDecl);
                };

                expect(start).to.not.throw();
                expect(appInstance.container).to.be.equal(injector);
            });

            it('should left the prototype chain unchanged after the constructor invoked', function() {

                const start = function() {
                    appInstance = prototypePoisoner.factory(injector, AppClassDecl);
                };

                expect(start).to.not.throw();
                expect(AppClassDecl.prototype.injector).to.be.undefined;
            });

            it('should have the injector in the created instance', function() {

                appInstance = prototypePoisoner.factory(injector, Extended);

                const testMethod = function() {
                    appInstance.testMethod();
                };

                expect(testMethod).to.not.throw();
                expect(Extended.prototype.injector).to.be.undefined;
                expect(appInstance.injector).to.be.equal(injector);
            });
        });
    });

    describe('function', function () {

        it('should make possible to access the injector from the function\'s context', function() {

            const testFunction = function(a, b) {
                this.injector.resolve('Whatever');
                return a + b;
            };

            let result = null;
            const start = function() {
                result = prototypePoisoner.function(injector, testFunction, 3, 4);
            };

            expect(start).to.not.throw();
            expect(result).to.be.equal(7);
        });

        it('should make possible to access the injector with custom name from the function\'s context', function() {

            const testFunction = function(a, b) {
                this.container.resolve('Whatever');
                return a + b;
            };

            prototypePoisoner = new PrototypePoisoner('container');

            let result = null;
            const start = function() {
                result = prototypePoisoner.function(injector, testFunction, 3, 4);
            };

            expect(start).to.not.throw();
            expect(result).to.be.equal(7);
        });
    });

    describe('static', function () {

        it('should simply return the instance object', function() {

            const testInstance = {};

            let result = prototypePoisoner.static(injector, testInstance);

            expect(result).to.be.equal(testInstance);
        });
    });
});
