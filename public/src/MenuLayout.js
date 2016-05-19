define(['backbone.marionette', 'text!templates/MenuLayout.html'], function (Marionette, template) {

    var MenuLayoutView = Marionette.LayoutView.extend({
        template: template
    });

    return MenuLayoutView;
});