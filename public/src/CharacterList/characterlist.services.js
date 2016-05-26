define(function (require) {

    return {
        factory: {
            'CharacterSearchView': require('CharacterList/views/CharacterSearchView'),
            'CharacterListCollectionView': require('CharacterList/views/CharacterListCollectionView'),
            'CharacterListItemView': require('CharacterList/views/CharacterListItemView'),
            'CharacterListCollection': require('CharacterList/collections/CharacterCollection'),
            'CharacterModel': require('CharacterList/models/CharacterModel')
        },
        static: {
            // Overridden
            'CharacterListLayoutTemplate': require('text!CharacterList/templates/CharacterListLayout.html'),
            'CharacterListCollectionTemplate': require('text!CharacterList/templates/CharacterListCollectionView.html')
        }
    };
});