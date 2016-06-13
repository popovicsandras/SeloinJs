'use strict';

requirejs.config({
    baseUrl: 'src',
    shim: {
        backbone: {
            deps: [
                'jquery',
                'underscore'
            ]
        },
        bootstrap: {
            deps: [
                'jquery'
            ]
        }
    },
    paths: {
        'seloin': '../bower_components/seloin/build/seloin.min',
        'backbone': '../bower_components/backbone/backbone-min',
        'backbone.babysitter': '../bower_components/backbone.babysitter/lib/backbone.babysitter.min',
        'backbone.marionette': '../bower_components/backbone.marionette/lib/backbone.marionette.min',
        'backbone.wreqr': '../bower_components/backbone.wreqr/lib/backbone.wreqr.min',
        'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
        'underscore': '../bower_components/underscore/underscore-min',
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'text': '../bower_components/text/text'
    }
});