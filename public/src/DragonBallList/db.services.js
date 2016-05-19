define(function (require) {

    return {
        'CharacterListLayout': require('CharacterList/views/CharacterListLayout'),
        // Overridden
        'CharacterListLayoutTemplate': require('text!DragonBallList/templates/DragonBallCharacterListLayout.html'),

        'CharacterSearchView': require('CharacterList/views/CharacterSearchView'),
        'CharacterListCollectionView': require('CharacterList/views/CharacterListCollectionView'),
        'CharacterListItemView': require('CharacterList/views/CharacterListItemView'),

        // Overridden
        'CharacterListCollection': require('DragonBallList/DragonBallCharacterCollection'),
        'DragonBallCharacterModel': require('DragonBallList/DragonBallCharacterModel')
    };
});