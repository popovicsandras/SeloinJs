define(['backbone.marionette'], function (Marionette) {

    var ListCollectionView = Marionette.CompositeView.extend({
        template: 'resolve::CharacterListCollectionTemplate',
        childView: 'resolve::CharacterListItemView',
        childViewContainer: "tbody",

        initialize: function(options) {
            this.injector = options.injector;
            this.collection.load();
        }
    });

    return ListCollectionView;
});