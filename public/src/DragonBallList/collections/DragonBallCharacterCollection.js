define(['backbone', 'DragonBallList/models/DragonBallCharacterModel'], function (Backbone, CharacterModel) {

    var DragonBallCharacterCollection = Backbone.Collection.extend({

        model: CharacterModel,

        //initialize: function() {
        //    this.model = this.injector.resolveProvider('CharacterModel');
        //},

        load: function() {
            this.reset([{
                name: 'Songoku',
                strength: '76',
                exp: 100
            },{
                name: 'Majin Vegeta',
                strength: '79',
                exp: 110
            },{
                name: 'Cell',
                strength: '62',
                exp: 82
            }]);
        }
    });

    return DragonBallCharacterCollection;
});