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

    });

    describe('static', function () {

        it('should simply return the instance object', function() {

            const testInstance = {};

            let result = prototypePoisoner.static(injector, testInstance);

            expect(result).to.be.equal(testInstance);
        });
    });
});
