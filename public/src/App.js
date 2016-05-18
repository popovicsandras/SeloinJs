define(['backbone.marionette', 'seloin', 'MainLayout'], function (Marionette, Seloin, MainLayout) {

    return Marionette.Application.extend({
        initialize: function(options) {
            this.addRegions({
                main: options.container
            });
            this.initInjector();
        },

        initInjector: function() {
            this.rootInjector = new Seloin.Injector({
                injectMethod: Seloin.Strategies.prototypePoisoner
            });
            this.rootInjector.register('MainLayout', MainLayout);
        },

        onStart: function() {
            var mainLayout = this.rootInjector.resolve('MainLayout');
            this.main.show(mainLayout);
        }
    });
});