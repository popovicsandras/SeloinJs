define(function (require) {

    var _ = require('underscore');

    return {
        factory: {
            'App': require('App'),
            'MainLayout': require('MainLayout'),
            'MenuLayout': require('MenuLayout'),
            'CharacterListLayout': require('CharacterList/views/CharacterListLayout')
        },
        static: {
            'MainLayoutTemplate': _.template(require('text!templates/MainLayout.html')),
            'MenuLayoutTemplate': _.template(require('text!templates/MenuLayout.html')),
            'CharacterListLayoutTemplate': _.template(require('text!CharacterList/templates/CharacterListLayout.html'))
        },
        config: {
            'original-component': require('CharacterList/characterlist.services'),
            'dragon-ball-characters': require('DragonBallList/db.services')
        }
    };
});