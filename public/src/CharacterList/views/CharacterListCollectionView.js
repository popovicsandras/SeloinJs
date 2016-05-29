define(['backbone.marionette', 'underscore'], function (Marionette, _) {

    var ListCollectionView = Marionette.CompositeView.extend({
        //template: _.template(template),
        childViewContainer: "tbody",

        initialize: function(options) {
            this.injector = options.injector;
            this.collection.load();
            this.template = _.template(this.injector.resolve('CharacterListCollectionTemplate'));
        },

        buildChildView: function(child, ChildViewClass, childViewOptions){
            var options = _.extend({model: child}, childViewOptions);
            var view = this.injector.resolve('CharacterListItemView', options);
            return view;
        }
    });

    return ListCollectionView;
});