define(function (require) {

    return {
        'MainLayout': require('MainLayout'),
        'MenuLayout': require('MenuLayout'),
        'TodoLayout': require('TodoList/views/TodoLayout'),
        'SearchView': require('TodoList/views/SearchView'),
        'ListCollectionView': require('TodoList/views/ListCollectionView'),
        'ListItemView': require('TodoList/views/ListItemView')
    };
});