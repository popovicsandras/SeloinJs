define(['backbone.marionette', 'text!../templates/ListCollectionView.html', 'underscore'], function (Marionette, template, _) {

    var ListCollectionView = Marionette.CompositeView.extend({
        template: _.template(template),
        childViewContainer: "tbody",

        getChildView: function() {
            return this.injector.resolve('ListItemView').constructor
        }
    });

    return ListCollectionView;
});