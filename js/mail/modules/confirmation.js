define([
    'jquery',
    'Ractive',
    'Mustache',
    'rv!TPL/confirmation.html'
], function($, Ractive, Mustache, ConfirmationTpl) {

    // 'use strict';

    var
    ConfirmationView = Ractive.extend({
        el: 'main',
        template: ConfirmationTpl,
        data: {
            creditUrl: 'http://beta.getfastcredit.com/fw_mail.php',
            client: {},
            customer: {},
            address: function () {
                var
                address = this.get('customer.CustomerAddressChange') || this.get('customer.CustomerAddress'),
                city = this.get('customer.CustomerCityChange') || this.get('customer.CustomerCity'),
                state = this.get('customer.CustomerStateChange') || this.get('customer.CustomerState'),
                zip = this.get('customer.CustomerZIPChange') || this.get('customer.CustomerZIP');
                return address + '<br>'+ city + ', ' + state.toUpperCase() + ' ' + zip;
            },
            currency: function (value) {
                return Number(value).toCurrency();
            },
            date: function (time) {
                var date;
                if (typeof time === 'string') {
                    time = Number(time) * 1000; // Convert time to milliseconds
                    date = moment(new Date(time)); // Create Moment object
                }
                return date.format('ddd, MMM Do YYYY');
            },
            fullname: function () {
                var
                fname = this.get('customer.CustomerFirstNameChange') || this.get('customer.CustomerFirstName'),
                lname = this.get('customer.CustomerLastNameChange') || this.get('customer.CustomerLastName'),
                fullname = fname + ' ' + lname;
                return fullname;
            },
            vehicle: function () {
                var
                vehicle = this.get('customer.tcusquestions_vehicle'),
                year = this.get('customer.tcusquestions_year'),
                make = this.get('customer.tcusquestions_make'),
                model = this.get('customer.tcusquestions_model');
                if (!vehicle)
                    return year + ' ' + make + ' ' + model;
                else
                    return vehicle;
            }
        },
        render: function(){
            return Mustache.render(this.template, this.get());
        }
    });

    return ConfirmationView;
    
});