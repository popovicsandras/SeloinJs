define(['backbone.marionette', 'text!templates/MainLayout.html', 'DragonBallList/db.services'], function (Marionette, template, DbDependencies) {

    var AppLayoutView = Marionette.LayoutView.extend({
        template: template,

        regions: {
            menu: "#menu",
            content: "#content"
        },

        onShow: function() {
            var menuLayout = this.injector.resolve('MenuLayout');
            this.menu.show(menuLayout);

            var dragonBallContainer = this.injector.createNamespace();
            for (var serviceName in DbDependencies) {
                if (DbDependencies.hasOwnProperty(serviceName)) {
                    dragonBallContainer.register(serviceName, DbDependencies[serviceName]);
                }
            }
            var DragonBallCharacterListLayout = dragonBallContainer.resolve('CharacterListLayout');
            this.content.show(DragonBallCharacterListLayout);
        }
    });

    return AppLayoutView;
});