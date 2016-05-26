define(function (require) {

    return {
        factory: {
            'CharacterSearchView': require('CharacterList/views/CharacterSearchView'),
            'CharacterListCollectionView': require('CharacterList/views/CharacterListCollectionView'),
            'CharacterListItemView': require('DragonBallList/views/DragonBallCharacterListItemView'),

            // Overridden
            'CharacterListCollection': require('DragonBallList/collections/DragonBallCharacterCollection'),
            'CharacterModel': require('DragonBallList/models/DragonBallCharacterModel')
        },
        static: {
            // Overridden
            'CharacterListLayoutTemplate': require('text!DragonBallList/templates/DragonBallCharacterListLayout.html'),
            'CharacterListCollectionTemplate': require('text!DragonBallList/templates/DragonBallCharacterListCollectionView.html'),
            'CharacterListItemTemplate': require('text!DragonBallList/templates/DragonBallCharacterListItemView.html')
        }
    };
});