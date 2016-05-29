define(['backbone', 'backbone.marionette'], function (Backbone, Marionette) {

    var oldCollection = Backbone.Collection;
    Backbone.Collection = function() {
        var options = arguments[arguments.length - 1];
        var resolution = /^resolve\:\:([a-zA-Z0-9\-]+)$/.exec(this.model);
        if (resolution && resolution[1]) {
            this.model = options.injector.resolveProvider(resolution[1]);
        }
        return oldCollection.apply(this, arguments);
    };

    Backbone.Collection.prototype = oldCollection.prototype;
    Backbone.Collection.extend = oldCollection.extend;


    oldCompositeView = Marionette.CompositeView;
    var SeloinCompositeView = oldCompositeView.extend({
        getChildView: function() {
            var childView = this.getOption('childView');

            var options = this.options;
            var resolution = /^resolve\:\:([a-zA-Z0-9\-]+)$/.exec(childView);
            if (resolution && resolution[1]) {
                this.childView = options.injector.resolveProvider(resolution[1]);
            }

            return oldCompositeView.prototype.getChildView.apply(this, arguments);
        }
    });

    Marionette.CompositeView = SeloinCompositeView;


    function BackboneResolver() {}
    BackboneResolver.prototype = {

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
        }
    };

    return BackboneResolver;
});