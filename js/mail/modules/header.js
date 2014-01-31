define([
    'jquery',
    'Ractive',
    'Mustache',
    'rv!TPL/header.html'
], function($, Ractive, Mustache, HeaderTpl) {

    var HeaderView = Ractive.extend({
        el: 'header',
        template: HeaderTpl,
        render: function(){
            return Mustache.render(this.template, this.get());
        }
    });

    return HeaderView;
    
});