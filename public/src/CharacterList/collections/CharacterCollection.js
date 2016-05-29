define(['backbone'], function (Backbone) {

    var CharacterCollection = Backbone.Collection.extend({

        model: 'resolve::CharacterModel',

        initialize: function() {
            var options = arguments[arguments.length - 1];
            this.injector = options.injector;
        },

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