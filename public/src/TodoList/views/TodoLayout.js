define(['backbone.marionette', 'text!../templates/TodoLayout.html'], function (Marionette, template) {

    var TodoLayoutView = Marionette.LayoutView.extend({
        template: template,

        regions: {
            search: ".search",
            list: ".list"
        },

        onShow: function() {
            var searchView = this.injector.resolve('SearchView'),
                listView = this.injector.resolve('ListCollectionView', {
                    collection: new Backbone.Collection([{
                        name: 'Songoku',
                        level: '76',
                        strength: 100
                    },{
                        name: 'Majin Vegeta',
                        level: '79',
                        strength: 110
                    },{
                        name: 'Cell',
                        level: '62',
                        strength: 82
                    }])
                });

            this.search.show(searchView);
            this.list.show(listView);
        }
    });

    return TodoLayoutView;
});