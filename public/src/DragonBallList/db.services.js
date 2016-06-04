define(function (require) {

    var _ = require('underscore');

    return {
        factory: {
            'CharacterListItemView': require('DragonBallList/views/DragonBallCharacterListItemView'),
            'CharacterListCollection': require('DragonBallList/collections/DragonBallCharacterCollection'),
            'CharacterModel': require('DragonBallList/models/DragonBallCharacterModel')
        },
        static: {
            'CharacterListCollectionTemplate': _.template(require('text!DragonBallList/templates/DragonBallCharacterListCollectionView.html')),
            'CharacterListItemTemplate': _.template(require('text!DragonBallList/templates/DragonBallCharacterListItemView.html'))
        }
    };
});