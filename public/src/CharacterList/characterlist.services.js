define(function (require) {

    var _ = require('underscore');

    return {
        factory: {
            'CharacterSearchView': require('CharacterList/views/CharacterSearchView'),
            'CharacterListCollectionView': require('CharacterList/views/CharacterListCollectionView'),
            'CharacterListItemView': require('CharacterList/views/CharacterListItemView'),
            'CharacterListCollection': require('CharacterList/collections/CharacterCollection'),
            'CharacterModel': require('CharacterList/models/CharacterModel')
        },
        static: {
            'CharacterListCollectionTemplate': _.template(require('text!CharacterList/templates/CharacterListCollectionView.html')),
            'CharacterListItemTemplate': _.template(require('text!CharacterList/templates/CharacterListItemView.html')),
            'CharacterSearchTemplate': _.template(require('text!CharacterList/templates/CharacterSearchView.html'))
        }
    };
});