define(['backbone.marionette', 'text!../templates/SearchView.html'], function (Marionette, template) {

    var SearchView = Marionette.ItemView.extend({
        template: template
    });

    return SearchView;
});