'use strict';

import { default as SimpleResolver } from '../../../lib/resolvers/SimpleResolver';

describe('SimpleResolver', function () {

    const injector = { resolve: function() {} };
    let simpleResolver,
        appInstance;

    beforeEach(function() {
        simpleResolver = new SimpleResolver();
    });

    describe('Factory', function () {

        class AppClassDecl {
            constructor(param1, param2) {
                this.param1 = param1;
                this.param2 = param2;
            }
        }

        it('should just create the proper instance of passed class without injection', function() {

            appInstance = simpleResolver.factory(injector, AppClassDecl, 'param1', 'param2');

            expect(appInstance.param1).to.be.equal('param1');
            expect(appInstance.param2).to.be.equal('param2');
        });
    });

    describe('Function', function () {

        const testFunction = function(a, b) {
            return a + b;
        };

        it('should just call the passed function without injection', function() {

            const result = simpleResolver.function(injector, testFunction, 3, 4);

            expect(result).to.be.equal(7);
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
