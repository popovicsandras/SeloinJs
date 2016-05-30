define(['backbone.marionette'], function (Marionette) {

    var MenuLayoutView = Marionette.LayoutView.extend({
        template: 'resolve::MenuLayoutTemplate'
    });

    return MenuLayoutView;
});