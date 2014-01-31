define([
    'jquery',
    'Ractive',
    'Mustache',
    'rv!TPL/footer.html'
], function($, Ractive, Mustache, FooterTpl) {

    var FooterApp = Ractive.extend({
        el: 'footer',
        template: FooterTpl,
        render: function(){
            return Mustache.render(this.template, this.get());
        }
    });

    return FooterApp;

});