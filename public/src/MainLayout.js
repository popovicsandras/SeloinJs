define(['backbone.marionette'], function (Marionette) {

    var AppLayoutView = Marionette.LayoutView.extend({

        regions: {
            menu: "#menu",
            original: "#original",
            dragonball: "#dragonball"
        },

        initialize: function() {
            this.template = this.injector.resolve('MainLayoutTemplate');
        },

        onShow: function() {
            var menuLayout = this.injector.resolve('MenuLayout');
            this.menu.show(menuLayout);

            var originalComponentContainer = this.injector.createChild('original-component');
            var CharacterListLayout = originalComponentContainer.resolve('CharacterListLayout');
            this.original.show(CharacterListLayout);

            var dragonBallContainer = this.injector.createChild('dragon-ball-characters');
            var DragonBallCharacterListLayout = dragonBallContainer.resolve('CharacterListLayout');
            this.dragonball.show(DragonBallCharacterListLayout);
        }
    });

    return AppLayoutView;
});