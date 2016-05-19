define(['backbone.marionette', 'text!../templates/CharacterListCollectionView.html', 'underscore'], function (Marionette, template, _) {

    var ListCollectionView = Marionette.CompositeView.extend({
        template: _.template(template),
        childViewContainer: "tbody",

        initialize: function() {
            this.collection.load();
        },

        getChildView: function() {
            return this.injector.resolve('CharacterListItemView').constructor
        }
    });

    return ListCollectionView;
});