define(['backbone', 'CharacterList/models/CharacterModel'], function (Backbone, CharacterModel) {

    var CharacterCollection = Backbone.Collection.extend({

        model: CharacterModel,

        //initialize: function() {
        //    this.model = this.injector.resolveProvider('CharacterModel');
        //},

        load: function() {
            this.reset([{
                name: 'John',
                hairColor: 'brown',
                eyeColor: 'brown'
            },{
                name: 'Jim',
                hairColor: 'blond',
                eyeColor: 'blue'
            },{
                name: 'Rasputin',
                hairColor: 'black',
                eyeColor: 'red'
            }]);
        }
    });

    return CharacterCollection;
});