'use strict';

import { default as ParamListPrepender } from '../../../lib/resolvers/ParamListPrepender.js';

describe('ParamListPrepender', function () {

    const injector = { resolve: function() {} };
    let paramListPrepender,
        appInstance;

    beforeEach(function() {
        paramListPrepender = new ParamListPrepender();
    });

    describe('Factory', function () {

        describe('Function declarations', function () {

            const AppFuncDecl = function(injector, param1, param2) {
                this.param1 = param1;
                this.param2 = param2;
                injector.resolve('Whatever');
            };

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

            class AppClassDecl {
                constructor(injector, param1, param2) {
                    this.param1 = param1;
                    this.param2 = param2;
                    injector.resolve('Whatever');
                }
            }

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

    describe('Function', function () {

        const testFunction = function(injector, a, b) {
            injector.resolve('Whatever');
            return a + b;
        };

        it('should make possible to access the injector from the constructor', function() {

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
