define([
    'jquery',
    'Ractive',
    'Mustache',
    'rv!TPL/verifyCode.html'
], function($, Ractive, Mustache, VerifyTpl) {

    var VerifyView = Ractive.extend({
        el: 'main',
        template: VerifyTpl,
        render: function(){
            return Mustache.render(this.template, this.get());
        }
    });

    return VerifyView;
    
});