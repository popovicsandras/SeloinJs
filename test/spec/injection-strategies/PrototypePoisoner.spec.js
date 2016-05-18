'use strict';

import { default as getPoisonedPrototypeInstance } from '../../../lib/injection-strategies/PrototypePoisoner.js';

describe('Prototype poisoner', function () {

    const injector = { resolve: function() {} };
    var appInstance;

    describe('[Function declarations]', function () {

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

            appInstance = getPoisonedPrototypeInstance(injector, AppFuncDecl, 'param1', 'param2');

            expect(appInstance.param1).to.be.equal('param1');
            expect(appInstance.param2).to.be.equal('param2');
        });

        it('should make possible to access the injector from the constructor', function() {

            const start = function() {
                appInstance = getPoisonedPrototypeInstance(injector, AppFuncDecl);
            };

            expect(start).to.not.throw();
            expect(appInstance.injector).to.be.equal(injector);
        });

        it('should left the prototype chain unchanged after the constructor invoked', function() {

            const start = function() {
                appInstance = getPoisonedPrototypeInstance(injector, AppFuncDecl);
            };

            expect(start).to.not.throw();
            expect(AppFuncDecl.prototype.injector).to.be.undefined;
        });

        it('should have the injector in the created instance', function() {

            appInstance = getPoisonedPrototypeInstance(injector, AppFuncDecl);

            const testMethod = function() {
                appInstance.testMethod();
            };

            expect(testMethod).to.not.throw();
            expect(AppFuncDecl.prototype.injector).to.be.undefined;
            expect(appInstance.injector).to.be.equal(injector);
        });
    });

    describe('[Class declarations]', function () {

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

            appInstance = getPoisonedPrototypeInstance(injector, AppClassDecl, 'param1', 'param2');

            expect(appInstance.param1).to.be.equal('param1');
            expect(appInstance.param2).to.be.equal('param2');
        });

        it('should make possible to access the injector from the constructor', function() {

            const start = function() {
                appInstance = getPoisonedPrototypeInstance(injector, AppClassDecl);
            };

            expect(start).to.not.throw();
            expect(appInstance.injector).to.be.equal(injector);
        });

        it('should left the prototype chain unchanged after the constructor invoked', function() {

            const start = function() {
                appInstance = getPoisonedPrototypeInstance(injector, AppClassDecl);
            };

            expect(start).to.not.throw();
            expect(AppClassDecl.prototype.injector).to.be.undefined;
        });

        it('should have the injector in the created instance', function() {

            appInstance = getPoisonedPrototypeInstance(injector, Extended);

            const testMethod = function() {
                appInstance.testMethod();
            };

            expect(testMethod).to.not.throw();
            expect(Extended.prototype.injector).to.be.undefined;
            expect(appInstance.injector).to.be.equal(injector);
        });
    });
});
