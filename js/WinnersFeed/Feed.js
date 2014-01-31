define([
    'winners',
    'notific8',
    'WinnersFeed'
], function(winners, notific8, Feed){

    'use strict';

    return {
        resize: function (type) {
            $('body').winners('resize', type);
        },
        halt: function () {
            $('body').winners('halt');
        },
        destroy: function () {
            $('body').winners('destroy');
        },
        init: function (options) {
            if ($(window).outerHeight() >= 768){
                $('body').winners({
                    job: options.job,
                    limit: {
                        local: 7,
                        national: 7,
                        jackpot: 1
                    }
                });
            } else {
                $('body').winners({
                    job: options.job,
                    limit: {
                        local: 4,
                        national: 4,
                        jackpot: 1
                    }
                });
            }
        }
    }
});