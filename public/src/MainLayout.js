define(['backbone.marionette', 'text!templates/MainLayout.html'], function (Marionette, template) {

    var AppLayoutView = Marionette.LayoutView.extend({
        template: template,

        regions: {
            menu: "#menu",
            content: "#content"
        },

        onShow: function() {
            var menuLayout = this.injector.resolve('MenuLayout'),
                todoLayout = this.injector.resolve('TodoLayout');

            this.menu.show(menuLayout);
            this.content.show(todoLayout);
        }
    });

    return AppLayoutView;
});