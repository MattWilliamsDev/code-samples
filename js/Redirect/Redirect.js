define([
    'Ractive',
    'Internal',
    'rv!TPL/widgets/redirect'
], function (Ractive, Internal, RedirectTpl) {
    
    // 'use strict';

    var Redirect = Ractive.extend({
        countdown: function () {
            var
            self = this,
            seconds = self.get('seconds'),
            counter = setInterval(timer, 1000), // Run timer() every second
            timer = function () {
                seconds = seconds - 1;

                if (seconds <= 0) {
                    clearInterval(counter);
                    self.redirect();
                    return;
                }

                self.set('seconds', seconds);
                console.log('Timer Secs', seconds);
            }
        },
        inject: function (panel) {
            var self = this;
            if (typeof panel === 'undefined') {
                panel = 'thankYou-content';
            } else {
                if (panel.substr(-7) !== '-content') {
                    panel = panel + '-content';
                }

                var
                div = $('<div/>'),
                el = '#' + self.el || '#redirector';

                div.attr('id', el);
                $(panel).append(div)
            }
        },
        redirect: function () {
            console.log('Redirect URL', self.get('url'));
            window.open(url, '_blank');
            // document.location.replace(self.get('url'));
            return;
        }
    });

    return function (options) {
        console.log('options', options);
        console.log('new Redirect', new Redirect({
            el: options.el || 'redirector',
            template: options.template || RedirectTpl,
            data: {
                seconds: 15,
                url: 'http://cubs.com'
            }
        }));

        var redirect = new Redirect({
            el: options.el || 'redirector',
            template: options.template || RedirectTpl,
            data: {
                seconds: options.seconds || 15,
                url: options.url || 'http://cubs.com'
            }
        });

        console.log('redirect obj', redirect);
        return redirect;
    }
});