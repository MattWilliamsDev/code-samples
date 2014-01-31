define([
    'jquery',
    'Ractive',
    'Mustache',
    'rv!TPL/terms.html'
], function($, Ractive, Mustache, TermsTpl) {

    var TermsApp = Ractive.extend({
        el: 'terms',
        template: TermsTpl,
        render: function(){
            return Mustache.render(this.template, this.get());
        }
    });

    return TermsApp;

});