define([
    'jquery',
    'Ractive',
    'Mustache',
    'rv!TPL/feed.html'
], function($, Ractive, Mustache, FeedTpl) {

    var
    IMGPATH = 'img/fwmail/',

    FeedView = Ractive.extend({
        el: 'feed',
        template: FeedTpl,
        data: {
            jackpot: {
                heading: 'The Monthly Progressive Jackpot',
                link: '#',
                winners: [
                    { image: 'img/fwmail/silhouette.png', first: 'Glenn', last: 'Danzig', city: 'Los Angeles', state: 'CA' },
                    { image: 'img/fwmail/silhouette.png', first: 'Cletus', last: 'Harper', city: 'Tupelo', state: 'MS' },
                    { image: 'img/fwmail/silhouette.png', first: 'Mantis', last: 'Toboggan', city: 'Philadelphia', state: 'PA' }
                ],
                description: 'The FATWIN Progressive Jackpot is a guaranteed prize, typically hovering between $5,000 and $10,000, that is offered across all of the promotions running on the FATWIN platform. The jackpot starts off at $5,000 and each time a user registers for a contest across the platform, $0.05 is added to the monthly jackpot given to a registrant of a contest that month. After the jackpot has been given away, the jackpot resets to $5,000 for the new month and the fun starts over.'
            },
            entrants: {
                displayed: {
                    fname: 'Joe',
                    lname: 'Smith',
                    city: 'Carmel',
                    state: 'IN',
                    time: new Date().getTime(),
                    type: 'entered'
                },
                queue: [],
            },
            stats: {
                contests: '3,372',
                participants: '1,334,584',
                progressive: Number('6750.04').toCurrency(),
                awarded: Number('3682591.03').toCurrency(),
            },
            format: function (string) {
                return string.toUpperCase();
            },
            formatTime: function (time) {
                var date;
                if (typeof time === 'string') {
                    time = Number(time)*1000; // Convert time to milliseconds
                    date = moment(new Date(time)); // Create new Moment object
                    date.tz('America/Indiana/Indianapolis'); // Set Timezone
                } else if (typeof time === 'object') {
                    console.log('time is an object', time);
                    date = time;
                }

                return date.format('hh:mm A'); // Return as a formatted time string
            }
        },
        init: function () {
            var self = this;

            this.updateQueue();
            this.updateJackpot();
            this.updateWinners();

            setInterval(function () {
                self.updateDisplayed();
            }, 10000);
        },
        updateJackpot: function () {
            var self = this;
            
            // Get current jackpot amount
            $.ajax({
                url: 'ProgressiveJackpot/current',
                success: function (data) {
                    console.log('Progressive Jackpot Updated', Number(data).toCurrency());
                    // Set the new jackpot amount to be displayed
                    self.set('stats.progressive', Number(data).toCurrency());
                },
                error: function (e) {
                    console.error(e.message);
                }
            });
        },
        updateQueue: function () {
            var
            self = this,
            job = this.get('job');
            
            $.ajax({
                url: 'Visitor/recent/' + job,
                type: 'post',
                data: {},
                dataType: 'json',
                complete: function (e) {},
                success: function (data) {
                    console.log('updateQueue Returned Data', data);
                    self.set('entrants.queue', data);
                    self.updateDisplayed();
                },
                error: function (e) {
                    console.error(e.message);
                }
            });
        },
        updateDisplayed: function (newObj) {
            var queue = this.get('entrants.queue');
            // console.log('updateDisplayed Queue', queue);
            if (typeof newObj !== 'undefined') {
                queue.unshift(newObj);
            }

            if (queue.length > 1) {
                this.set('entrants.displayed', queue.shift());
                this.set('entrants.queue', queue);
            }
        },
        updateWinners: function () {
            var
            self = this;

            $.ajax({
                url: 'ProgressiveJackpot/winners',
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    console.log('Progressive Jackpot Winners Updated', data);
                    var image, winners = [];
                    $.each(data, function (idx, row) {
                        image = row.image;
                        row.image = image;
                        winners.push(row);
                    });
                    self.set('jackpot.winners', winners);
                },
                error: function (e) {
                    console.error(e);
                }
            });
        },
        render: function () {
            return Mustache.render(this.template, this.get());
        }
    });

    return FeedView;
    
});