define(['backbone'], function (Backbone) {

    var CharacterModel = Backbone.Model.extend({
        defaults: {
            name: '',
            hairColor: '',
            eyeColor: ''
        },

        initialize: function(attributes, options) {
            if (!options.injector) {
                throw new Error('Injector has to be accessible through options');
            }
        }
    });

    return CharacterModel;
});