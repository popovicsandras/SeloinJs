define(['backbone'], function (Backbone) {

    var CharacterModel = Backbone.Model.extend({
        defaults: {
            name: '',
            hairColor: '',
            eyeColor: ''
        }
    });

    return CharacterModel;
});