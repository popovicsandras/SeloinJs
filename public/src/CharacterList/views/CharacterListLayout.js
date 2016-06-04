define(['backbone.marionette', '../characterlist.services'], function (Marionette, defaultComponentConfig) {

    var TodoLayoutView = Marionette.LayoutView.extend({

        template: 'resolve::CharacterListLayoutTemplate',

        initialize: function(options) {
            this.injector = options.injector;
            this.injector.initScope(defaultComponentConfig);
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