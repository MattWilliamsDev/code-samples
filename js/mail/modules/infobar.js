define([
    'jquery',
    'Ractive',
    'Mustache',
    'rv!TPL/infobar.html'
], function($, Ractive, Mustache, InfoBarTpl) {

    var InfoBarView = Ractive.extend({
        el: 'infobar',
        template: InfoBarTpl,
        data: {
            determineArticle: function (name) {
                var article;
                switch (name.substr(0,1)) {
                    case 'a':
                    case 'e':
                    case 'i':
                    case 'o':
                    case 'u':
                        article = 'An';
                        break;

                    default:
                        article = 'A';
                        break;
                }

                return article;
            }
        },
        render: function(){
            return Mustache.render(this.template, this.get());
        }
    });

    return InfoBarView;
    
});