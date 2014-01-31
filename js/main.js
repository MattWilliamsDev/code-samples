requirejs.config({
    paths: {
        // Scripts
        "Ascensor"              : "../vendor/Ascensor.js/dist/jquery.ascensor",
        "Bootstrap"             : "../vendor/perq-compiled/js/bootstrap.min",
        "Currency"              : "../vendor/jquery-formatcurrency/jquery.formatCurrency",
        "Datepicker"            : "../vendor/datepicker/js/datepicker",
        "Director"              : "../vendor/director/build/director",
        "Easing"                : "../vendor/jquery.easing/jquery.easing.1.3.min",
        "Form"                  : "../vendor/jquery-ajaxform/jquery.form",
        "jQuery"                : "../vendor/jquery/jquery.min",
        "liquidslider"          : "../vendor/liquidslider/js/jquery.liquid-slider.min",
        "Modal"                 : "../vendor/bootstrap/js/modal",
        "moment"                : "../vendor/momentjs/moment",
        "Mustache"              : "../vendor/mustache/mustache",
        "notific8"              : "../vendor/perq-winnersfeed/jquery.notific8",
        "nprogress"             : "../vendor/nprogress/nprogress",
        "Ractive"               : "../vendor/ractive/Ractive",
        "Redirect"              : "../vendor/redirector/jquery.redirector",
        "ResponsiveIframe"      : "../vendor/responsiveiframe/dist/jquery.responsiveiframe.min",
        "rv"                    : "../vendor/ractive-text/rv",
        "Scrollbars"            : "../vendor/jquery-custom-scrollbar/jquery.mCustomScrollbar.concat.min",
        "text"                  : "../vendor/requirejs-text/text",
        "TouchSwipe"            : "../vendor/jquery-touchswipe/jquery.touchSwipe.min",
        "Validate"              : "../vendor/jquery-validation/jquery.validate",
        "ValidateMethods"       : "../vendor/jquery-validation/additional-methods",
        "Vegas"                 : "../vendor/vegas/dist/jquery.vegas.min",
        "winners"               : "../vendor/perq-winnersfeed/jquery.winners",
        // Social requirments
        "facebook"              : "//connect.facebook.net/en_US/all",
        "twitter"               : "//platform.twitter.com/widgets",
        "fb"                    : "../social/fb",
        "gplus"                 : "//apis.google.com/js/client.js?onload=handleClientLoad",
        "gplus2"                : "//apis.google.com/js/plusone",
        "myTwitter"             : "../social/twitter",
        "myGplus"               : "../social/mygplus",

        //Browser Detection 
        "tyBrowser"             : "browser", 

        // RequireJS Plugins
        "async"                 : '../vendor/requirejs-plugins/src/async',
        "font"                  : '../vendor/requirejs-plugins/src/font',
        "goog"                  : '../vendor/requirejs-plugins/src/goog',
        "image"                 : '../vendor/requirejs-plugins/src/image',
        "json"                  : '../vendor/requirejs-plugins/src/json',
        "noext"                 : '../vendor/requirejs-plugins/src/noext',
        "mdown"                 : '../vendor/requirejs-plugins/src/mdown',
        "propertyParser"        : '../vendor/requirejs-plugins/src/propertyParser',
        "markdownConverter"     : '../vendor/requirejs-plugins/lib/Markdown.Converter',
        
        // Modules
        "Compatibility"         : "Compatibility/Compatibility",
        "Client"                : "Client/Client",
        "Inputs"                : "Inputs",
        "InstantWin"            : "InstantWin/InstantWin",
        "Internal"              : "Internal/Internal",
        "Panels"                : "Panels/Panels",
        "Progression"           : "Progression/Progression",
        "SpinCounter"           : "SpinCounter/SpinCounter",
        "User"                  : "User/User",
        "Window"                : "window",
        "WinnersFeed"           : "WinnersFeed/Feed",
        
        // Folders
        "JS"                    : "../js",
        "TPL"                   : "../tpl",
        "VENDOR"                : "../vendor"
    },
    shim: {
        "app": {
            deps: ['jQuery', 'Datepicker', 'liquidslider', 'ResponsiveIframe', 'helpers', 'Redirect']
        },
        "Ascensor": {
            deps: ['jQuery']
        },
        "Bootstrap": {
            deps: ['jQuery']
        },
        "Compatibility": {
            deps: ['jQuery']
        },
        "Currency": {
            deps: ['jQuery']
        },
        "Datepicker": {
            deps: ['jQuery']
        },
        "Easing": {
            deps: ['jQuery']
        },
        "Form": {
            deps: ['jQuery']
        },
        "facebook" : {
            exports: 'FB'
        },
        "fb": {
            deps: ['facebook']
        },
        "liquidslider": {
            deps: ['jQuery', 'Easing', 'TouchSwipe']
        },
        "Modal": {
            deps: ['jQuery']
        },
        "notific8": {
            deps: ['jQuery']
        },
        "nprogress": {
            deps: ['jQuery']
        },
        "Redirect": {
            deps: ['jQuery']
        },
        "ResponsiveIframe": {
            deps: ['jQuery']
        },
        "TouchSwipe": {
            deps: ['jQuery']
        },
        "Scrollbars": {
            deps: ['jQuery']
        },
        "Validate": {
            deps: ['jQuery']
        },
        "ValidateMethods": {
            deps: ['jQuery', 'Validate']
        },
        "Vegas": {
            deps: ['jQuery']
        }
    },
    waitSeconds: 15
});

require([
    'app',
    'Bootstrap',
    'Modal',
    'Scrollbars',
    'Vegas'

    // 'Transition'
], function(App, Bootstrap, Modal, Scrollbars, Vegas){

    'use strict';

    NProgress.start();
    App.init();    

});