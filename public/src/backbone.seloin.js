define(['backbone', 'backbone.marionette'], function (Backbone, Marionette) {

    function makeClassResolveStringAware(constructorFunction) {

        var originalConstructorFunction = constructorFunction;
        constructorFunction = function() {

            this.injector = arguments[arguments.length - 1].injector;

            var propertiesToCheck = ['model', 'childView', 'template'];
            for (var i in propertiesToCheck) {
                var prop = propertiesToCheck[i];

                if (typeof this[prop] === 'string') {
                    var resolution = /^resolve\:\:([a-zA-Z0-9\-]+)$/.exec(this[prop]);
                    if (resolution && resolution[1]) {
                        this[prop] = this.injector.resolveProvider(resolution[1]);
                    }
                }
            }

            return originalConstructorFunction.apply(this, arguments);
        };

        constructorFunction.prototype = originalConstructorFunction.prototype;
        constructorFunction.extend = originalConstructorFunction.extend;

        return constructorFunction;
    }

    Backbone.Collection = makeClassResolveStringAware(Backbone.Collection);
    Marionette.CompositeView = makeClassResolveStringAware(Marionette.CompositeView);
    Marionette.ItemView = makeClassResolveStringAware(Marionette.ItemView);


    function BackboneInjector() {}
    BackboneInjector.prototype = {

        factory: function(injector, Service) {
            var args = Array.prototype.slice.call(arguments, 2);
            if (args.length === 0) {
                args.push({
                    injector: injector
                });
            } else {
                var options = args[args.length-1] || {};
                options.injector = injector;
            }

            var Surrogate = function() {
                Service.prototype.constructor.apply(this, args);
            };
            Surrogate.prototype = Object.create(Service.prototype);
            Surrogate.prototype.constructor = Surrogate;
            return new Surrogate();
        },

        function: function(injector, service) {
        },

        autoInjectedFactory(injector, Service, ServiceName) {
            let Surrogate = function() {
                var args = Array.prototype.slice.call(arguments);
                if (args.length === 0) {
                    args.push({
                        injector: injector
                    });
                } else {
                    var options = args[args.length-1] || {};
                    options.injector = injector;
                }

                Service.apply(this, args);
            };
            Surrogate.prototype = Object.create(Service.prototype);
            Surrogate.prototype.constructor = Surrogate;
            Surrogate.__origin__ = ServiceName;
            return Surrogate;
        },

        autoInjectedFunction(injector, service, serviceName) {
        },

        static(injector, instance) {
            return instance;
        },

        autoInjectedStatic(injector, instance) {
            return instance;
        }
    };

    return BackboneInjector;
});