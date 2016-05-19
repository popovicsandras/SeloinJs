define(['backbone'], function (Backbone) {

    var DragonBallCharacterCollection = Backbone.Collection.extend({
        load: function() {
            this.reset([{
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
            }]);
        }
    });

    return DragonBallCharacterCollection;
});