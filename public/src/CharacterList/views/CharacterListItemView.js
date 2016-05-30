define(['backbone.marionette'], function (Marionette) {

    var ListItemView = Marionette.ItemView.extend({
        tagName: 'tr',
        template: 'resolve::CharacterListItemTemplate'
    });

    return ListItemView;
});