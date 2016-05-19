define(['backbone.marionette', 'text!../templates/CharacterListItemView.html', 'underscore'], function (Marionette, template, _) {

    var ListItemView = Marionette.ItemView.extend({
        tagName: 'tr',
        template: _.template(template),

        ui: {
            increaseButton: '.increase-value',
            decreaseButton: '.decrease-value',
            powerLevel: '.character-level',
            exp: '.character-exp'
        },

        events: {
            'click @ui.increaseButton': 'increaseValue',
            'click @ui.decreaseButton': 'decreaseValue'
        },

        initialize: function() {
            this.listenTo(this.model, 'change:exp', this.updateValues);
        },

        increaseValue: function() {
            this.model.increaseExp();
        },

        decreaseValue: function() {
            this.model.decreaseExp();
        },

        serializeData: function() {
            return _.extend(this.model.toJSON(), {
                powerLevel: this.model.getPowerLevel()
            });
        },

        updateValues: function() {
            this.ui.powerLevel.html(this.model.getPowerLevel());
            this.ui.exp.html(this.model.get('exp'));
        }
    });

    return ListItemView;
});