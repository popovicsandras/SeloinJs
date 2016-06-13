'use strict';

import { default as NoInjection } from '../../../lib/Injectors/NoInjection';

describe('SimpleResolver', function () {

    const injector = { resolve: function() {} };
    let simpleResolver,
        appInstance;

    class AppClassDecl {
        constructor(param1, param2) {
            this.param1 = param1;
            this.param2 = param2;
        }
    }

    const testFunction = function(a, b) {
        return a + b;
    };

    beforeEach(function() {
        simpleResolver = new NoInjection();
    });

    describe('Factory', function () {

        it('should just create the proper instance of passed class without injection', function() {

            appInstance = simpleResolver.factory(injector, AppClassDecl, 'param1', 'param2');

            expect(appInstance.param1).to.be.equal('param1');
            expect(appInstance.param2).to.be.equal('param2');
        });
    });

    describe('autoInjectedFactory', function () {

        it('should just simply return the given factory', function() {

            const AppClassDeclProvider = simpleResolver.autoInjectedFactory(injector, AppClassDecl, 'AppClassDecl');

            expect(AppClassDeclProvider).to.be.equal(AppClassDecl);
        });
    });

    describe('Function', function () {

        it('should just call the passed function without injection', function() {

            const result = simpleResolver.function(injector, testFunction, 3, 4);

            expect(result).to.be.equal(7);
        });
    });

    describe('autoInjectedFunction', function () {

        it('should just simply return the given function', function() {

            const testFunctionProvider = simpleResolver.autoInjectedFunction(injector, testFunction, 'testFunction');

            expect(testFunctionProvider).to.be.equal(testFunction);
        });
    });


    describe('Static', function () {

        it('should simply return the instance object', function() {

            const testInstance = {};

            let result = simpleResolver.static(injector, testInstance);

            expect(result).to.be.equal(testInstance);
        });
    });
});
