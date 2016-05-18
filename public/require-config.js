'use strict';

requirejs.config({
    baseUrl: 'src',
    shim: {
        backbone: {
            deps: [
                'jquery',
                'underscore'
            ]
        }
    },
    paths: {
        'seloin': '../seloin',
        'backbone': '../bower_components/backbone/backbone-min',
        'backbone.babysitter': '../bower_components/backbone.babysitter/lib/backbone.babysitter.min',
        'backbone.marionette': '../bower_components/backbone.marionette/lib/backbone.marionette.min',
        'backbone.wreqr': '../bower_components/backbone.wreqr/lib/backbone.wreqr.min',
        'underscore': '../bower_components/underscore/underscore-min',
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'text': '../bower_components/text/text'
    }
});