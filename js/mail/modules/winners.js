define([
    'jquery',
    'Ractive',
    'Mustache',
    'rv!TPL/winners.html'
], function($, Ractive, Mustache, WinnersTpl) {

    var WinnersApp = Ractive.extend({
        el: 'winners',
        template: WinnersTpl,
        data: {
            winners: [
                {
                    image: 'img/fwmail/silhouette.png',
                    first: 'New',
                    last: 'Winner1',
                    prize: 'Super Prize Time',
                    city: 'Indianapolis',
                    state: 'IN'
                },
                {
                    image: 'img/fwmail/silhouette.png',
                    first: 'New',
                    last: 'Winner2',
                    prize: 'Super Happy Prize Time',
                    city: 'Indianapolis',
                    state: 'IN'
                },
                {
                    image: 'img/fwmail/silhouette.png',
                    first: 'New',
                    last: 'Winner3',
                    prize: 'Super Fun Prize Time',
                    city: 'Indianapolis',
                    state: 'IN'
                },
                {
                    image: 'img/fwmail/silhouette.png',
                    first: 'New',
                    last: 'Winner4',
                    prize: 'Super Duper Prize Time',
                    city: 'Indianapolis',
                    state: 'IN'
                },
            ]
        },

        addWinner: function (winner) {
            var winners = this.get('winners');
            winners.unshift(winner);
            this.set('winners', winners);
        },

        removeWinner: function () {
            var winners = this.get('winners');
            winners.pop();
            this.set('winners', winners);
        },

        replaceWinner: function (winner) {
            this.addWinner(winner);
            this.removeWinner();
        },

        render: function() {
            return Mustache.render(this.template, this.get());
        }
    });

    return WinnersApp;

});