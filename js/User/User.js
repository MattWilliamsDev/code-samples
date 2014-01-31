define([
    'Internal'
    // 'jQuery',
    // 'Ractive',
], function (Internal) {

    // 'use strict';
    
    var User = {
        id: '',
        key: 0,
        firstname: '',
        lastname: '',
        name: '',
        job: 0,
        subjob: 0,
        phone: '',
        cell: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: 0,
        fullAddress: '',
        scanned: false,
        testrecord: true,
        year: 0,
        make: '',
        model: '',
        vehicle: '',
        value: 0,
        bonus: 0,
        tradeTotal: 0,
        appointment: {
            time: '',
            date: ''
        },
        isTemp: false,
        q1id: null,
        q2id: null,
        q3id: null,
        q4id: null,
        share: false,
        init: function (options) {
            var
            url,
            uri,
            key,
            tempKey,
            job,
            subjob,
            share,
            callback,
            create = false,
            user = {},
            config = {},
            self = this;

            console.log('User Init Options', options);
            if (typeof options === 'object') {
                try {
                    var vis = User.logNewVisitor({
                        job: options.job,
                        gurl: options.gurl,
                        callback: function (result) {
                            var
                            data = result[0],
                            status = result[1],
                            xhr = result[2];

                            // console.log('callback data', data);
                            self.isTemp = true;
                            self.tempKey = data.CustomerKey;
                            self.id = data.tcusprizesel_no;

                            return self;
                        }
                    });
                } catch (error) {
                    console.error('Error:', error.message);
                }

                if (options.share) {
                    self.share = options.share;
                }

                if (options.deferred === true) {
                    if (options.job) {
                        job = options.job;
                        self.job = options.job;
                    }
                    return self;
                }

                if (typeof options.create === 'boolean') {
                    create = options.create;
                } else {
                    if (options.CustomerKey || options.key) {
                        create = false;
                        // Load the existing customer
                        try {
                            self.key = options.CustomerKey || options.key;
                        } catch (error) {
                            console.error('Error:', error.message);
                        }
                        
                    } else if (options.job) {
                        // Create a new customer
                        create = true;
                        job = options.job;
                        
                        if (options.subjob) {
                            subjob = options.subjob;
                        } else {
                            subjob = 1;
                        }

                        share = options.share || false;

                    } else {
                        throw ({ message: 'No Job # or Customer Key Specified', debug: options });
                    }
                }

                callback = options.callback;
            } else if (typeof options === 'string' || typeof options === 'number') {
                // If passed a string, assume it's the Job #
                create = true; 
                job = options;
                subjob = 1;
            } else {
                // It's invalid - GTFO
                throw ({ message: 'Invalid Options', debug: options });
            }

            if (create === true) {

                try {
                    self.create(job, subjob, share);
                } catch (error) {
                    console.error(error.message);
                }

            } else if (create === false) {

                try {
                    self.refresh(self.key);
                } catch (error) {
                    console.error(error.message);
                }

            } else {
                throw ({
                    message: 'Not sure whether to create or update!',
                    debug: {
                        options: options,
                        create: create
                    }
                });
            }

            if (typeof callback === 'function') {
                callback.call(this, arguments);
            }

            return self;
        },
        load: function (key) {
            return User.refresh(key);
        },
        // create: function (job, subjob) {
        create: function () {
            var
            uri,
            url,
            config,
            key,
            self = this;

            // console.log('create::this', {job: self.job, key: self.key});

            // self.job = job;
            if (typeof subjob !== 'undefined') {
                self.subjob = subjob;
            } else {
                self.subjob = 1;
            }

            // if ()

            uri = '/' + self.job + '/' + self.subjob;

            if (typeof self.key !== 'undefined') {
                uri += '/' + self.key;
            }

            url = Internal.formatRelativeUrl('Customer/create' + uri);
            console.log('Create URL', {url: url, uri: uri});
            
            $.ajax({
                url: url,
                dataType: "json",
                type: 'post',
                data: {
                    share: share
                },
                async: false,
                success: function (data) {
                    console.log('Create Successful');
                    config = data;
                    key = data.CustomerKey;

                    return config;
                },
                complete: function (xhr, data) {
                    console.log('Create Complete', {xhr: xhr, data: data});
                    self.set(config);
                    // self.set('visitor', );
                    $(User).trigger('userCreated', [self]);
                }
            });
        },
        refresh: function (key) {
            var self = this;

            if (typeof key === 'undefined') {
                key = self.key;
            }

            var
            uri = 'Customer/view/' + key,
            refreshUrl = Internal.formatRelativeUrl(uri);
            
            $.ajax({
                url: refreshUrl,
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    console.log('User Refresh Successful', data);
                    try {
                        User.set(data);
                    } catch (e) {
                        console.error(e.message);
                    }
                },
                complete: function () {
                    $(User).trigger('userRefresh', [User]);
                }
            });
        },
        get: function (attr) {
            if (attr) {
                return attribute = this[attr];
            } else {
                return this;
            }
        },
        set: function (attr, value) {
            if (typeof attr === 'string') {
                this[attr] = value;
            } else if (typeof attr === 'object') {
                value = attr;
                attr = null;
                try {
                    $.extend(true, User, value);
                } catch (error) {
                    console.error('Error:', error.message);
                }
            }
        },
        logNewVisitor: function (options) {
            var
            self = this,
            job = options.job,
            gurl = options.gurl,
            callback = options.callback,
            visitor,
            url;

            console.log('logNewVisitor options', options);
            
            if (typeof job === 'undefined') {
                throw (new Error('No Job # Defined'));
            } else if (typeof gurl === 'undefined') {
                throw (new Error('No GURL Defined'));
            }

            url = Internal.formatRelativeUrl('Visitor/create/' + job + '/' + gurl);
            console.log('logNewVisitor URL', url);

            $.ajax({
                url: url,
                // data: {},
                dataType: 'json',
                success: function (data) {
                    return visitor = data;
                },
                complete: function (data) {
                    // console.log('logNewVisitor Data', data);
                    
                    self.set({
                        id: visitor.tcusprizesel_id,
                        key: visitor.CustomerKey
                    });
                    // console.log('logNewVisitor - Self', self);
                    
                    if (typeof callback === 'function') {
                        return callback.call(this, arguments);
                    }
                }
            });
        }
    };

    Object.defineProperties(User, {
        key: {
            get: function (){
                return this.CustomerKey;
            },
            set: function (val){
                this.CustomerKey = val;
            },
            enumerable: true,
            configurable: true
        },
        firstname: {
            get: function (){
                return this.CustomerFirstNameChange;
            },
            set: function (val){
                this.CustomerFirstNameChange = val;
            },
            enumerable: true,
            configurable: true
        },
        lastname: {
            get: function (){
                return this.CustomerLastNameChange;
            },
            set: function (val){
                this.CustomerLastNameChange = val;
            },
            enumerable: true,
            configurable: true
        },
        name: {
            get: function (){
                return this.CustomerFirstNameChange + ' ' + this.CustomerLastNameChange;
            },
            set: function (val){
                var names = val.split(' ');
                this.CustomerFirstNameChange = names[0];
                this.CustomerLastNameChange = names[1];
            },
            enumerable: true,
            configurable: true
        },
        job: {
            get: function (){
                return this.jobs_no;
            },
            set: function (val){
                this.jobs_no = val;
            },
            enumerable: true,
            configurable: true
        },
        subjob: {
            get: function (){
                return this.subjobs_no;
            },
            set: function (val){
                this.subjobs_no = val;
            },
            enumerable: true,
            configurable: true
        },
        phone: {
            get: function (){
                return this.CustomerPhone;
            },
            set: function (val){
                this.CustomerPhone = val;
            },
            enumerable: true,
            configurable: true
        },
        cell: {
            get: function (){
                return this.CustomerCell;
            },
            set: function (val){
                this.CustomerCell = val;
            },
            enumerable: true,
            configurable: true
        },
        email: {
            get: function (){
                return this.CustomerEmail;
            },
            set: function (val){
                this.CustomerEmail = val;
            },
            enumerable: true,
            configurable: true
        },
        address: {
            get: function (){
                return this.CustomerAddressChange;
            },
            set: function (val){
                this.CustomerAddressChange = val;
            },
            enumerable: true,
            configurable: true
        },
        city: {
            get: function (){
                return this.CustomerCityChange;
            },
            set: function (val){
                this.CustomerCityChange = val;
            },
            enumerable: true,
            configurable: true
        },
        state: {
            get: function (){
                return this.CustomerStateChange;
            },
            set: function (val){
                this.CustomerStateChange = val;
            },
            enumerable: true,
            configurable: true
        },
        zip: {
            get: function (){
                return this.CustomerZIPChange;
            },
            set: function (val){
                this.CustomerZIPChange = val;
            },
            enumerable: true,
            configurable: true
        },
        fullAddress: {
            get: function (){
                return {
                    address: this.address,
                    city: this.city,
                    state: this.state,
                    zip: this.zip
                }
            },
            enumerable: true,
            configurable: true
        },
        scanned: {
            get: function (){
                return this.Scanned;
            },
            set: function (val){
                this.Scanned = val;
            },
            enumerable: true,
            configurable: true
        },
        testrecord: {
            get: function (){
                return this.TestRecord;
            },
            set: function (val){
                this.TestRecord = val;
            },
            enumerable: true,
            configurable: true
        },
        vehicle: {
            get: function (){
                return this.CustomerYearMakeModel;
            },
            set: function (val){
                this.CustomerYearMakeModel = val;
                var opt = this.CustomerYearMakeModel.split(' ');

                this.year = opt[0];
                this.make = opt[1];
                this.model = opt[2];
            },
            enumerable: true,
            configurable: true
        },
        appointment: {
            get: function (){
                return this.appt;
            },
            set: function (val){
                this.appt = val;
            },
            enumerable: true,
            configurable: true
        },
        apptDate: {
            get: function (){
                return this.apptdate;
            },
            set: function (val){
                this.apptdate = val;
            },
            enumerable: true,
            configurable: true
        },
        apptTime: {
            get: function (){
                return this.appttime;
            },
            set: function (val){
                this.appttime = val;
            },
            enumerable: true,
            configurable: true
        },
        timestamp: {
            get: function (){
                return this.ts;
            },
            set: function (val){
                this.ts = val;
            },
            enumerable: true,
            configurable: true
        },
        question1_id: {
            get: function (){
                return this.q1id;
            },
            set: function (val){
                this.q1id = val;
            },
            enumerable: true,
            configurable: true
        },
        question2_id: {
            get: function (){
                return this.q2id;
            },
            set: function (val){
                this.q2id = val;
            },
            enumerable: true,
            configurable: true
        },
        question3_id: {
            get: function (){
                return this.q3id;
            },
            set: function (val){
                this.q3id = val;
            },
            enumerable: true,
            configurable: true
        },
        question4_id: {
            get: function (){
                return this.q4id;
            },
            set: function (val){
                this.q4id = val;
            },
            enumerable: true,
            configurable: true
        },
        id: {
            get: function (){
                return this.tcusprizesel_no;
            },
            set: function (val){
                this.tcusprizesel_no = val;
            },
            enumerable: true,
            configurable: true
        }
    });

    return User;
});