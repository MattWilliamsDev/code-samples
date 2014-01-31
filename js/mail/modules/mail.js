define([
    'Ractive',
    'Mustache',
    'rv!TPL/inputCode.html'
], function(Ractive, Mustache, IndexTpl) {
    
    'use strict';

    var MailApp = Ractive.extend({
        el: 'main',
        template: IndexTpl,
        data: {
            code: '',
            customer: {},
            client: {},
            goodcode : false,
            badcode : true,
            fullname: function () {
                var
                fname = this.get('fname'),
                lname = this.get('lname'),
                fullname = fname + ' ' + lname;

                return fullname;
            }
        },
        verify: function (selector) {
            console.log('Running Verify');
            var
            client = this.get('client'),
            code = $(selector).val();

            console.log('verify vars', {code: code, verifycode: client.verifycode});
            if (code != client.verifycode) {
                // this.set({
                //     goodcode: false,
                //     badcode: true
                // });
            } else {
                this.markRedeemed();
                // this.set({
                //     goodcode: true,
                //     badcode : false
                // });
            }
        },
        markRedeemed: function () {
            console.log('Marking Redeemed');
            var customer = this.get('customer');
            $.ajax({
                url: 'Prize/Update/' + customer.jobs_no + '/' + customer.CustomerKey,
                success: function (data) {
                    console.log('Redeemed Data', data);
                },
                error: function (e) {
                    console.error(e.message);
                }
            });
        },
        submit: function (formId) {
            
        },
        render: function(){
            return Mustache.render(this.template, this.get());
        },
        validation: {}
    });

    return MailApp;

});