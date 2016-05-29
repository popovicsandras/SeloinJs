define(['backbone.marionette'], function (Marionette) {

    return Marionette.Application.extend({
        initialize: function(options) {
            this.injector = options.injector;
            this.addRegions({
                main: options.container
            });
        },

        onStart: function() {
            var mainLayout = this.injector.resolve('MainLayout');
            this.main.show(mainLayout);
        }
    });
});