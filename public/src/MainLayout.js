define(['backbone.marionette', 'text!templates/MainLayout.html'], function (Marionette, template) {

    var AppLayoutView = Marionette.LayoutView.extend({
        template: template,

        regions: {
            menu: "#menu",
            content: "#content"
        },

        initialize: function() {
            console.log(this.injector);
        }
    });

    return AppLayoutView;
});