requirejs.config({
    paths: {
        "Bootstrap"             : "../../vendor/perq-compiled/js/bootstrap.min",
        "Currency"              : "../../vendor/jquery-formatcurrency/jquery.formatCurrency",
        "Datepicker"            : "../../vendor/datepicker/js/datepicker",
        "Director"              : "../../vendor/director/build/director",
        "Easing"                : "../../vendor/jquery.easing/jquery.easing.1.3.min",
        "Form"                  : "../../vendor/jquery-ajaxform/jquery.form",
        "jQuery"                : "../../vendor/jquery/jquery.min",
        "Modal"                 : "../../vendor/bootstrap/js/modal",
        "moment"                : "../../vendor/momentjs/moment",
        "moment-timezone"       : "../../vendor/momentjs-timezone/moment-timezone",
        "moment-timezone-data"  : "../../vendor/momentjs-timezone/moment-timezone-data",
        "Mustache"              : "../../vendor/mustache/mustache",
        "notific8"              : "../../vendor/perq-winnersfeed/jquery.notific8",
        "nprogress"             : "../../vendor/nprogress/nprogress",
        "Ractive"               : "../../vendor/ractive/Ractive",
        "Redirect"              : "../../vendor/redirector/jquery.redirector",
        "ResponsiveIframe"      : "../../vendor/responsiveiframe/dist/jquery.responsiveiframe.min",
        "rv"                    : "../../vendor/ractive-text/rv",
        "Scrollbars"            : "../../vendor/jquery-custom-scrollbar/jquery.mCustomScrollbar.concat.min",
        "text"                  : "../../vendor/requirejs-text/text",
        "TouchSwipe"            : "../../vendor/jquery-touchswipe/jquery.touchSwipe.min",
        "Validate"              : "../../vendor/jquery-validation/jquery.validate",
        "ValidateMethods"       : "../../vendor/jquery-validation/additional-methods",
        "Vegas"                 : "../../vendor/vegas/dist/jquery.vegas.min",
        "winners"               : "../../vendor/perq-winnersfeed/jquery.winners",

        // RequireJS Plugins
        "async"                 : '../../vendor/requirejs-plugins/src/async',
        "font"                  : '../../vendor/requirejs-plugins/src/font',
        "goog"                  : '../../vendor/requirejs-plugins/src/goog',
        "image"                 : '../../vendor/requirejs-plugins/src/image',
        "json"                  : '../../vendor/requirejs-plugins/src/json',
        "noext"                 : '../../vendor/requirejs-plugins/src/noext',
        "mdown"                 : '../../vendor/requirejs-plugins/src/mdown',
        "propertyParser"        : '../../vendor/requirejs-plugins/src/propertyParser',
        "markdownConverter"     : '../../vendor/requirejs-plugins/lib/Markdown.Converter',
        
        // Modules
        "Mail"                  : 'modules/mail',
        "Internal"              : "../Internal/Internal",
        
        // Template Path Shortcut
        "TPL"                   : '../../tpl/modules/mail'
    },
    shim: {
        'app': {
            deps: ['jQuery', 'Easing', 'Datepicker', 'Director', 'ResponsiveIframe', 'Redirect']
        },
        "Bootstrap": {
            deps: ['jQuery']
        },
        "Currency": {
            deps: ['jQuery']
        },
        "Director": {
            exports: 'Router'
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
        "FWMail": {
            deps: ['jQuery']
        },
        "Modal": {
            deps: ['jQuery']
        },
        "moment-timezone": {
            deps: ['moment']
        },
        "moment-timezone-data": {
            deps: ['moment', 'moment-timezone']
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
        "Validate": {
            deps: ['jQuery']
        },
        "ValidateMethods": {
            deps: ['jQuery', 'Validate']
        },
        "Vegas": {
            deps: ['jQuery']
        }
    }
});

require([
    'app'
], function(App){

    'use strict';

    App.init(window.currentJob, window.purl);

});