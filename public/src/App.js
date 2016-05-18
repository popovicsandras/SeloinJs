define(['backbone.marionette', 'seloin', 'app.services'], function (Marionette, Seloin, AppDependencies) {

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
            this.rootInjector.load(AppDependencies);
        },

        onStart: function() {
            var mainLayout = this.rootInjector.resolve('MainLayout');
            this.main.show(mainLayout);
        }
    });
});