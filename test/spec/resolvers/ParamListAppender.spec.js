'use strict';

import { default as ParamListAppender } from '../../../lib/Resolvers/ParamListAppender';

describe('ParamListAppender', function () {

    const injector = { resolve: function() {} };
    let paramListAppender,
        appInstance;

    beforeEach(function() {
        paramListAppender = new ParamListAppender();
    });

    describe('Factory', function () {

        const AppFuncDecl = function(param1, param2) {
            const injector = arguments[arguments.length - 1];
            this.param1 = param1;
            this.param2 = param2;
            injector.resolve('Whatever');
        };

        class AppClassDecl {
            constructor(param1, param2) {
                const injector = arguments[arguments.length - 1];
                this.param1 = param1;
                this.param2 = param2;
                injector.resolve('Whatever');
            }
        }

        given(AppFuncDecl, AppClassDecl)
            .it('should make possible to access the injector from the constructor', function(ConstructorDeclaration) {

                const start = function() {
                    appInstance = paramListAppender.factory(injector, ConstructorDeclaration);
                };

                expect(start).to.not.throw();
            });

        given(AppFuncDecl, AppClassDecl)
            .it('should create an instance of given class with the passed parameters', function(ConstructorDeclaration) {

                appInstance = paramListAppender.factory(injector, ConstructorDeclaration, 'param1', 'param2');

                expect(appInstance.param1).to.be.equal('param1');
                expect(appInstance.param2).to.be.equal('param2');
            });
    });

    describe('Function', function () {

        const testFunction = function(a, b) {
            const injector = arguments[arguments.length - 1];
            injector.resolve('Whatever');
            return a + b;
        };

        it('should call the passed function with injecting the injector as last parameter', function() {

            let result = null;
            const start = function() {
                result = paramListAppender.function(injector, testFunction, 3, 4);
            };

            expect(start).to.not.throw();
            expect(result).to.be.equal(7);
        });
    });

    describe('Static', function () {

        it('should simply return the instance object', function() {

            const testInstance = {};

            let result = paramListAppender.static(injector, testInstance);

            expect(result).to.be.equal(testInstance);
        });
    });
});
