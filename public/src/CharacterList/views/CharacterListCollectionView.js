define(['backbone.marionette', 'underscore'], function (Marionette, _) {

    var ListCollectionView = Marionette.CompositeView.extend({
        //template: _.template(template),
        childViewContainer: "tbody",
        childView: 'resolve::CharacterListItemView',

        initialize: function(options) {
            this.injector = options.injector;
            this.collection.load();
            this.template = _.template(this.injector.resolve('CharacterListCollectionTemplate'));
        }
    });

    return ListCollectionView;
});