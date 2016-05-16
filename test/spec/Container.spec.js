'use strict';

const Container = require('../../lib/Container.js');

class TestClass {
    constructor (loc8r, str, func, obj) {
        this.str = str;
        this.func = func;
        this.obj = obj;
    }
}

class TestClass2 {

}

describe('Service Locator container', function (){

    it('should throw an Error if the dependency to be resolved is not registered', function() {

        const container = new Container();

        const testFunc = function() {
            container.resolve('test');
        };

        expect(testFunc).to.throw(Error, 'Dependency not found: test');
    });

    it('should resolve the registered service', function() {

        const container = new Container();

        container.register('TestClass', TestClass);

        expect(container.resolve('TestClass')).to.be.an.instanceOf(TestClass);
    });

    it('should resolve the registered service with additional arguments', function() {

        const expectedStr = 'Diva Plavalaguna 5X',
            expectedFunc = function() { return 'Multipass!'; },
            expectedObj = {
                color: 'super-green'
            },
            container = new Container();

        container.register('TestClass', TestClass);

        const instance = container.resolve('TestClass', expectedStr, expectedFunc, expectedObj);
        expect(instance.str).to.be.equal(expectedStr);
        expect(instance.func).to.be.equal(expectedFunc);
        expect(instance.obj).to.be.equal(expectedObj);
    });

    it('should not overwrite an already registered service', function() {

        const container = new Container();

        container.register('TestClass', TestClass);
        try {
            container.register('TestClass', TestClass2);
        }
        catch(e) {
            expect(container.resolve('TestClass')).to.be.an.instanceOf(TestClass);
        }
    });

    it('should throw an Error if the dependency to be registered is already registered', function() {

        const container = new Container();
        container.register('SupaDupaTestClass', TestClass);

        const testFunc = function() {
            container.register('SupaDupaTestClass', TestClass2);
        };

        expect(testFunc).to.throw(Error, 'Dependency is already registered: SupaDupaTestClass -> TestClass');
    });

    it('should inject the service locator container into the resolved object\'s constructor', function() {

        class App {
            constructor(loc8r) {
                loc8r.resolve('TestClass');
            }
        }

        const container = new Container();
        container.register('TestClass', TestClass);
        container.register('App', App);

        const app = container.resolve('App');
    });
});