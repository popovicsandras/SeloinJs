define(['backbone'], function (Backbone) {

    var DragonBallCharacterModel = Backbone.Model.extend({
        defaults: {
            name: '',
            strength: 0,
            exp: 0
        },
        idAttribute: 'name',

        increaseExp: function() {
            var newExp = this.get('exp') + 1;
            this.set('exp', newExp);
        },

        decreaseExp: function() {
            var newExp = Math.max((this.get('exp') - 1), 0);
            this.set('exp', newExp);
        },

        getPowerLevel: function() {
            return Math.max(Math.round(Math.pow(this.get('exp'), 3/4)), 1);
        }
    });

    return DragonBallCharacterModel;
});