define(['backbone.marionette'], function (Marionette) {

    var SearchView = Marionette.ItemView.extend({
        template: 'resolve::CharacterSearchTemplate'
    });

    return SearchView;
});