define([], function () {

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
        },

        autoInjectedFunction(injector, service, serviceName) {
        },

        static(injector, instance) {
            return instance;
        }
    };

    return BackboneResolver;
});