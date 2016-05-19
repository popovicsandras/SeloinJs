define(['backbone.marionette', 'text!../templates/CharacterSearchView.html'], function (Marionette, template) {

    var SearchView = Marionette.ItemView.extend({
        template: template
    });

    return SearchView;
});