define(['backbone.marionette', 'text!DragonBallList/templates/DragonBallCharacterListLayout.html', 'underscore'], function (Marionette, overriddenTemplate, _) {

    var AppLayoutView = Marionette.LayoutView.extend({

        regions: {
            menu: "#menu",
            original: "#original",
            dragonball: "#dragonball"
        },

        template: 'resolve::MainLayoutTemplate',

        onShow: function() {
            var menuLayout = this.injector.resolve('MenuLayout');
            this.menu.show(menuLayout);

            var originalComponentContainer = this.injector.createChild('original-component');
            var CharacterListLayout = originalComponentContainer.resolve('CharacterListLayout');
            this.original.show(CharacterListLayout);

            var dragonBallContainer = this.injector.createChild('dragon-ball-characters');
            dragonBallContainer.static('CharacterListLayoutTemplate', _.template(overriddenTemplate));
            var DragonBallCharacterListLayout = dragonBallContainer.resolve('CharacterListLayout');
            this.dragonball.show(DragonBallCharacterListLayout);
        }
    });

    return AppLayoutView;
});