define(function (require) {

    return {
        factory: {
            'App': require('App'),
            'MainLayout': require('MainLayout'),
            'MenuLayout': require('MenuLayout'),
            'CharacterListLayout': require('CharacterList/views/CharacterListLayout')
        },
        static: {
            'MainLayoutTemplate': require('text!templates/MainLayout.html')
        },
        config: {
            'original-component': require('CharacterList/characterlist.services'),
            'dragon-ball-characters': require('DragonBallList/db.services')
        }
    };
});