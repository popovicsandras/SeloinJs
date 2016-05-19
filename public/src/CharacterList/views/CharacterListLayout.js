define(['backbone.marionette'], function (Marionette) {

    var TodoLayoutView = Marionette.LayoutView.extend({

        initialize: function() {
            this.template = this.injector.resolve('CharacterListLayoutTemplate');
        },

        regions: {
            search: ".search",
            list: ".list"
        },

        onShow: function() {
            var searchView = this.injector.resolve('CharacterSearchView'),
                listView = this.injector.resolve('CharacterListCollectionView', {
                    collection: this.injector.resolve('CharacterListCollection', [])
                });

            this.search.show(searchView);
            this.list.show(listView);
        }
    });

    return TodoLayoutView;
});