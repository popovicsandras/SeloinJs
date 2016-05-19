define(['backbone.marionette', 'text!../templates/CharacterListLayout.html'], function (Marionette, template) {

    var TodoLayoutView = Marionette.LayoutView.extend({
        template: template,

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