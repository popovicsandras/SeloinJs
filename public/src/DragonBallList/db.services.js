define(function (require) {

    var _ = require('underscore');

    return {
        factory: {
            'CharacterSearchView': require('CharacterList/views/CharacterSearchView'),
            'CharacterListCollectionView': require('CharacterList/views/CharacterListCollectionView'),
            'CharacterListItemView': require('DragonBallList/views/DragonBallCharacterListItemView'),
            'CharacterListCollection': require('DragonBallList/collections/DragonBallCharacterCollection'),
            'CharacterModel': require('DragonBallList/models/DragonBallCharacterModel')
        },
        static: {
            'CharacterListLayoutTemplate': _.template(require('text!DragonBallList/templates/DragonBallCharacterListLayout.html')),
            'CharacterListCollectionTemplate': _.template(require('text!DragonBallList/templates/DragonBallCharacterListCollectionView.html')),
            'CharacterListItemTemplate': _.template(require('text!DragonBallList/templates/DragonBallCharacterListItemView.html')),
            'CharacterSearchTemplate': _.template(require('text!CharacterList/templates/CharacterSearchView.html'))
        }
    };
});