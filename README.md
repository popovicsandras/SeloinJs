# Seloin - Yet another javascript Service Locator

![](https://travis-ci.org/popovicsandras/seloin.svg?branch=master) [![npm version](https://badge.fury.io/js/seloin.svg)](https://badge.fury.io/js/seloin)

## Installation

```bash
$ npm install seloin
```

## Introduction
Seloin is a **Service Locator** library implemented in javascript. You can use Seloin in different ways, ranging from having **one global service locator container** only (which is discouraged), to having **hierarchical linked service locator containers** with extra features like optional auto locator injecton during the service resolution or config file support. You can use Seloin with ES5 and ES6 either.

*Service Locator pattern is a type of Dependency Injection technique, with it's own advantages and disadvantages.
You can read more about Service Locator and other Dependency Injection patterns [here (wikipedia.org)](https://en.wikipedia.org/wiki/Service_locator_pattern) and [here (martinfowler.com)](http://martinfowler.com/articles/injection.html).*

## Table of Contents  
 * [Guide](#guide)  
   * [Registering and resolving services](#registering-and-resolving-services)
     * [Factory](#factory)
     * [Function](#function)
     * [Static](#static-singleton)
   * [Resolving providers](#resolving-providers)
   * [Using one-level deep service container](#using-one-level-deep-service-container)
   * [Nested service containers (scopes)](#nested-service-containers-scopes)
     * [Root container](#root-container)
     * [Child containers](#child-containers)
     * [Service shadowing](#service-shadowing)
   * [Service locator container injection strategies](#service-locator-container-injection-strategies)
     * [No injection](#no-injection)
     * [Parameter list prepender](#parameter-list-prepender)
     * [Parameter list appender](#parameter-list-appender)
     * [Prototype Poisoner](#prototype-poisoner)
   * [Container initialization with config objects](#container-initialization-with-config-objects)
     * [Config objects](#config-objects)
     * [config](#config)
     * [initScope](#initscope)
 * [API Reference](#api-reference) 

___

## Guide

#### Registering and resolving services
You can define your services as **factory**, **function** or **static** (singleton).

##### Factory
During resolution of a factory, a new instance of resolved "class" will be returned.
```javascript
class Car {
    constructor(color) {
        this.color = color;
    }
}

const container = new Seloin.Container();
container.factory('Car', Car);

const blueCar = container.resolve('Car', 'blue');
const redCar = container.resolve('Car', 'red');
```

##### Function
During resolution of a function, the resolved function will be invoked.
```javascript
function sum(a, b) {
    return a + b; 
}

const container = new Seloin.Container();
container.function('sum', sum);

const result = container.resolve('sum', 3, 4);
// result === 7
```

##### Static (singleton)
During resolution of a static, the registered object/string/number/chocobo will be returned. Thus, it can act like a singleton.

```javascript
const myObject = { foo: 'bar' };

const container = new Seloin.Container();
container.static('myObject', myObject);

const myObject1 = container.resolve('myObject');
const myObject2 = container.resolve('myObject');
// myObject1 === myObject2 === myObject
```


#### Resolving providers
In some cases you might need to resolve the originally registered class or function and not the instance or the result of the function. For this reason, you can resolve them with the resolveProvider method.

```javascript
class Car {}
function sum() {}

const container = new Seloin.Container();
container.factory('Car', Car);
container.function('sum', sum);

const CarProvider = container.resolveProvider('Car');
// CarProvider === Car
const sumProvider = container.resolveProvider('sum');
// sumProvider === sum
```


#### Using one-level deep service container
After you created your service container you can have it globally (discouraged) or pass it as a parameter through the resolution, to be able to access it from your classes and functions. [For this type of usage you can see examples below](#no-injection). 

However Seloin gives you more sophisticated features from creating child containers (scopes) to resolution with auto-injected container. 


#### Nested service containers (scopes)
With Seloin you can create linked service containers (parent <- child), where you can register your services. Every service container has 3 options to set:

- **scope**:*string* - the name of the container, "root" by default
- **parent**:*Container* - the parent container, null by default
- **injector**:*Injector* - the resolving injection strategy, NoInjection by default

##### Root container
When creating a (root) container, you usually don't have to set anything, except if you prefer to use anything other than the default values.
```javascript
const container = new Seloin.Container({
    scope: 'custom-scope-name',
    injector: new Seloin.Injectors.ParamListPrepender()
});
```
##### Child containers
Creating a (child) container can be done with the **createChild** method. Setting the parent when creating child scopes will be automatically done for you by the **createChild** method. 
```javascript
const container = new Seloin.Container({});
// container.scope === 'root'
const child = container.createChild('child-scope-name');
// child.scope === 'child-scope-name'
// child.parent === container
```

When you create a child container usually you only have to specify the scope name of the child container (see above). The parent attribute will be automatically linked for you, and the child scope will inherit the injector from it's parent scope. However you can override the injector of the child scope, if you don't want it to inherit from it's parent scope.
```javascript
const container = new Seloin.Container();
const child = container.createChild({
    scope: 'child-scope-name',
    injector: new CustomInjector()
});
```

##### Service shadowing
During the resolution of a service, the service is attempted to be resolved first on the current service container, and bubbles up through the parent containers (if exist) until the root container or until the service is found on any of the parent containers. This means a registered 'Car' service on a parent container will be shadowed by any of it's child container 'Car' services, if exists.
```javascript
class JustACar {}
class Honda {}

const container = new Seloin.Container();
container.factory('Car', JustACar);

const carComponent = container.createChild('carComponent');
const hondaComponent = container.createChild('hondaComponent');
// Shadows container's Car 
hondaComponent.factory('Car', Honda);

const car = carComponent.resolve('Car');
// car is instance of JustACar, resolved by container since carComponent doesn't have registered Car service on it
const honda = hondaComponent.resolve('Car');
// honda is instance of Honda, resolved by hondaComponent since hondaComponent has registered Car service on it
```

#### Service locator container injection strategies
During resolution you have different ways of having your service locator containers auto-injected. By default there is no auto-injection during the resolution.


##### No injection

###### resolve
This is the default injection startegy, which has no injection. If you want to access the service locator container from the resolved entity, you have to pass it during resolution.
```javascript
class Engine {}
class Car {
    constructor(color, container) {
        this.color = color;
        this.engine = container.resolve('Engine', 'V8');
    }
}

const container = new Seloin.Container();
container.factory('Car', Car);
container.factory('Engine', Engine);

const car = container.resolve('Car', 'blue', container);
```

###### resolveProvider
With this default injector, resolving the provider just simply returns the originally registered service provider.
```javascript
class Car {}
function sum() {}

const container = new Seloin.Container();
container.factory('Car', Car);
container.function('sum', sum);

const CarProvider = container.resolveProvider('Car');
// CarProvider === Car
const sumProvider = container.resolveProvider('sum');
// sumProvider === sum
```


##### Parameter list prepender

###### resolve
Optionally you can configure the Seloin container to inject the container itself during the resolution of a service by default. One of these auto-injection types is the **parameter list prepender** which injects the container as the first argument of the constructur function.

```javascript
class Engine {}
class Car {
    constructor(container, color) {
        this.color = color;
        this.engine = container.resolve('Engine', 'V8');
    }
}

// Configure the container to use ParamListPreprender injector to inject the container
const container = new Seloin.Container({
    injector: new Seloin.Injectors.ParamListPrepender()
});
container.factory('Car', Car);
container.factory('Engine', Engine);

// container is autoinjected here as the first argument
const car = container.resolve('Car', 'blue');
```

###### resolveProvider
Resolving the provider of a registered service having the **Parameter list prepender** as the container's injector will return a modified, auto-injected surrogate class/function. For this reason use the resolveProvider method of **Parameter list prepender** carefully, since everytime it creates a new derived class / wrapped function from the original class/function. The container is auto-injected as the first Parameter, which means that you don't have to pass the container when you create a new instance / call the function of the returned provider.

```javascript
class Car {
    constructor(container, color) {
        // you can access the container here...
        this.color = color;
    }
}
function sum(container, a, b) {
    // you can access the container here...
    return a + b;
}

const container = new Seloin.Container({
    injector: new Seloin.Injectors.ParamListPrepender()
});
container.factory('Car', Car);
container.function('sum', sum);

const CarProvider = container.resolveProvider('Car');
// CarProvider !== Car
const car = new CarProvider('blue');
// Note that you don't have to inject the container manually but you can use it in the constructor

const sumProvider = container.resolveProvider('sum');
// sumProvider !== sum
const result = sumProvider(3, 4);
// Note that you don't have to inject the container manually but you can use it in the sum function
// result === 7
```


##### Parameter list appender
under implementation


##### Prototype Poisoner
under implementation


#### Container initialization with config objects
Instead of registering your services manually on containers, you can use config files to wire your application/component. In config files, you can define your factory, function and static services and another configs for child scopes too. 

##### Config objects
The syntax of config file and config object are the following:
```javascript
import {SampleFactory, SampleFactory2, SampleFunction, SampleStatic, ChildConfig} from 'Sample';

var componentConfig = {
    factory: {
        'SampleFactory': SampleFactory,
        'SampleFactory2': SampleFactory2
    },
    function: {
        'SampleFunction': SampleFunction
    },
    static: {
        'SampleStatic': SampleStatic
    },
    config: {
        'child-scope-name': ChildConfig
    }
};
```
##### config
You can register the configuration object on your container with the **config** method. **Invoking the config method will only register the configuration object you passed in, and not the contents of it.**

When you call the config method on a container the following happens:
- the name for the configuration obejct will be computed from the "config:" prefix and the container's name. For example, for a container with the scope name of **"namek"**, this generated config name wil be **"config:namek"**.
- The container registers the passed configuration object on itself with the previously computed name as a static service. *Basically config(configObject) is just a shorthand method for static('config:<scope-name>', configObject).*

```javascript
import {appConfig} from 'appConfig';

const rootContainer = new Seloin.Container();
rootContainer.config(appConfig);
// rootContainer.resolve('conf:root') === appConfig
```

Now you have the appConfig object registered in you rootContainer under the name of "config:root". To parse this config object and have every service to be registered on the container, you need to initialise the rootContainer scope with the [initScope](#initscope) method.

##### configScope
Beside config method, you have the **configScope** method too, which has 2 parameters:
- name of the scope (usually child scope)
- config object for the scope
```javascript
rootContainer.configScope('supa-dupa-scope', configObject);
```

With this method you can register child scope configuration objects on you container.
```javascript
import {childConfig} from 'childConfig';

const rootContainer = new Seloin.Container();
rootContainer.configScope('supa-dupa-scope', childConfig);
// rootContainer.resolve('conf:supa-dupa-scope') === childConfig
```

##### initScope
The initScope method takes one parameter, the defaultConfigObject, which is optional.

The initScope method's behaviour is the following:
- resolve the **configObject** ("config:<scope-name>") for registed configobject, if exists
- merge the **defaultConfigObject** with the resolved **configObject**. In case of conflicts (same service names) the resolved **configObject**'s value takes precedence. This way you can always override services from parents as a way of setting dependencies for the child container.
- parse the merged configobject and load the contents of it to the container. Factories, functions, statics and config objects will be loaded too.

```javascript
var appConfig = {
    factory: {
        'SampleFactory': SampleFactory
    },
    function: {
        'SampleFunction': SampleFunction
    },
    config: {
        'child-scope-name': ChildConfig
    }
};

const rootContainer = new Seloin.Container();
rootContainer.config(appConfig);
rootContainer.initScope();
// rootContainer.resolve('SampleFactory') === SampleFactory
// rootContainer.resolve('SampleFunction') === SampleFunction
// rootContainer.resolve('config:child-scope-name') === ChildConfig
```

Using initScope usually make sense in two cases:
- initialising the root container after registesting it's config object on it
- initialising a reusable component

The first case is almost obvious, and the example above makes it clear.

If you want to make a reusable component, the only thing you have to do is to initialise your component from for example your component's constructor.

```javascript

var componentConfig = {
    factory: { 'SampleFactory': SampleFactory2 },
    function: { 'SampleFunction': SampleFunction }
};
var appConfig = {
    factory: { 'SampleFactory': SampleFactory },
    config: { 'supa-child-scope': componentConfig }
};

const rootContainer = new Seloin.Container();
rootContainer.config(appConfig);
rootContainer.initScope();
// rootContainer.resolve('SampleFactory') === SampleFactory
// rootContainer.resolve('config:supa-child-scope') === componentConfig

const supaChildScope = rootContainer.createChild('supa-child-scope');
supaChildScope.initScope();
// supaChildScope.resolve('SampleFactory') === SampleFactory2
// supaChildScope.resolve('SampleFunction') === SampleFunction
```

For further examples of usage see project's [public directory](https://github.com/popovicsandras/seloin/tree/master/public) on Github for a demo application using Backbone & Marionette with Seloin or the [mini integration tests](https://github.com/popovicsandras/seloin/blob/master/test/spec/Injector.spec.js).
