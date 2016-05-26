define(['backbone.marionette', 'text!../templates/CharacterListItemView.html', 'underscore'], function (Marionette, template, _) {

    var ListItemView = Marionette.ItemView.extend({
        tagName: 'tr',
        template: _.template(template)
    });

    return ListItemView;
});