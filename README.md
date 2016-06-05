# Seloin - Service Locator Injection library

![](https://travis-ci.org/popovicsandras/SeloinJs.svg?branch=master) [![npm version](https://badge.fury.io/js/seloin.svg)](https://badge.fury.io/js/seloin)

More appropiate readme is coming soon, until then see the public directory for a demo application using Backbone & Marionette with Seloin.

## Introduction
Seloin is a **Service Locator** implemented in javascript with automatic locator injection during the service resolution. Instead of having one global Service locator singleton, the locator/injector/container is injected into the resolved class/function.

*Service Locator pattern is a type of Dependency Injection technique, with it's own advantages and disadvantages.
You can read more about Service Locator and other Dependency Injection patterns [here](https://en.wikipedia.org/wiki/Service_locator_pattern).*

## Guide

#### Lifecycle methods
You can define your services as **factory**, **function** or **static** (singleton).

##### Factory
During resolution of a factory a new instance of resolved "class" will be returned.
```javascript
class Car {
    constructor(injector, color) {}
}

const rootInjector = new Seloin.Injector();
rootInjector.factory('Car', Car);

const car = rootInjector.resolve('Car', 'blue');
const car2 = rootInjector.resolve('Car', 'red');
// car and car2 are instances of Car
// car !== car2
```

##### Function
During resolution of a function the resolved function will be invoked.
```javascript
function sum(injector, a, b) { return a + b; }

const rootInjector = new Seloin.Injector();
rootInjector.function('sum', sum);

const result = rootInjector.resolve('sum', 3, 4);
// result === 7
```

##### Static (singleton)
During resolution the registered object/string/number will be returned. Thus, it can act like a singleton.

```javascript
const myObject = { foo: 'bar' };

const rootInjector = new Seloin.Injector();
rootInjector.static('myObject', myObject);

const myObject1 = rootInjector.resolve('myObject');
const myObject2 = rootInjector.resolve('myObject');
// myObject1 === myObject2 === myObject
```

#### Nested service containers (scopes)
With Seloin you can create linked service containers (parent <- child), where you can register your services. 
```javascript
class Car {}
class CarAnotherDefinition {}

const rootInjector = new Seloin.Injector();
const childContainer1 = rootInjector.createChild('container1');
const childContainer2 = rootInjector.createChild('container2');
rootInjector.factory('Car', Car);
childContainer2.factory('Car', CarAnotherDefinition);

const honda = childContainer1.resolve('Car');
const mercedes = childContainer2.resolve('Car');
// honda is instance of Car, resolved by rootInjector since childContainer1 doesn't have registered Car service on it
// mercedes is instance of CarAnotherDefinition, resolved by childContainer2 since childContainer2 has registered Car service on it
```
During the resolution of a service, the service is attempted to be resolved first on the current service container, and bubbles up through the parent containers (if exist) until the root container.

#### Different service locator injection strategies
##### Parameter list prepender
##### Parameter list appender
##### Prototype Poisoner
##### Simple resolver (no injection)

#### Config files
Todo

#### Creating reusable components with Seloin
Todo

## API Reference
