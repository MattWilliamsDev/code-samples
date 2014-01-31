define([
    'jquery',
    'Ractive',
    'Mustache',
    'rv!TPL/questions.html',
    'Internal'
], function($, Ractive, Mustache, QuestionsTpl, Internal) {
    
    var
    yearsObj = [],
    currentYear = 2014,
    floorYear = 1985;

    while (currentYear >= floorYear) {
        var yearObj = {
            label: currentYear,
            value: currentYear
        };
        --currentYear;
        yearsObj.push(yearObj);
    }

    var QuestionsApp = Ractive.extend({
        el: 'main',
        template: QuestionsTpl,
        data: {
            grandPrize: {
                prizes: [
                    { name: '$100,000 Cash Giveaway', status: 'unselected', selected: false },
                    { name: 'His &amp; Her Vehicles', status: 'unselected', selected: false }
                ],
                input: 'prize'
            },
            nada: {
                years: yearsObj,
                makes: [],
                models: [],
                miles: [
                    { label: '0 - 10,000', value: 10000 },
                    { label: '10,000 - 20,000', value: 20000 },
                    { label: '20,000 - 30,000', value: 30000 },
                    { label: '30,000 - 40,000', value: 40000 },
                    { label: '40,000 - 50,000', value: 50000 },
                    { label: '50,000 - 60,000', value: 60000 },
                    { label: '60,000 - 70,000', value: 70000 },
                    { label: '70,000 - 80,000', value: 80000 },
                    { label: '80,000 - 90,000', value: 90000 },
                    { label: '90,000 - 100,000', value: 100000 },
                    { label: '100,000+', value: '100000+' }
                ],
                trims: [],
                conditions: ['Rough', 'Average', 'Clean']
            },
            vehicle: {
                year: 2013,
                make: 'Nissan',
                model: 'Versa',
                mileage: 10000,
                value: Number(20000).toCurrency(),
                basedOn: ''
            },
            appt: {
                times: [
                    { label: 'Select a time', value: '' }
                ]
            },
            currency: function (value) {
                return Number(value).toCurrency();
            },
            fullname: function () {
                var
                fname = this.get('fname'),
                lname = this.get('lname'),
                fullname = fname + ' ' + lname;

                return fullname;
            }
        },

        formatPhone: function (phone) {
            console.log('formatting', phone);
            phone = this.get('phone');

            var newPhone = String(phone);
            newPhone = newPhone.replace(/[^0-9]/g, '');
            newPhone = newPhone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

            console.log('phone - formatted', newPhone);
            
            return newPhone;
        },

        selectPrize: function (newActive, oldActive) {
            var
            // input = this.get('grandPrize'),
            // $input = $('#' + input),
            uri = {
                active: 'grandPrize.prizes.' + newActive,
                inactive: 'grandPrize.prizes.' + oldActive
            };

            this.set(uri.active + '.selected', true);
            this.set(uri.inactive + '.selected', false);

            this.set(uri.active + '.status', 'selected');
            this.set(uri.inactive + '.status', 'deselected');

            this.set('grandPrize.selected', newActive);
            
            console.log('Running SelectPrize function', {
                newActive: newActive,
                old: oldActive,
                data: this.get('grandPrize')
            });
        },

        setLead: function (key) {
            var returnData;
            if (typeof key === 'undefined')
                key = this.get('customer.CustomerKey');

            /*
             * We can run this two ways:
             * 1. We can run it and manually "build" the url by appending the customer key
             * 2. We can use POST data to build it
             */
            $.ajax({
                url: Internal.formatRelativeUrl('Leads/save/'+ key),
                // data: { key: key },
                type: 'post',
                dataType: 'json',
                async: false,
                complete: function (e) {},
                success: function (data) {
                    console.log('Leads Save Success', data);
                    returnData = {
                        key: data.CustomerKey,
                        date: data.date
                    };

                    console.log('Triggering update.lead', returnData);
                    $(document).trigger('update.lead', returnData);

                },
                error: function (e) {
                    console.error(e.message);
                }
            });
        },

        updateMakes: function () {
            var
            valueType,
            self = this,
            year = this.get('vehicle.year'),
            makes = [];

            if (this.get('client.nada.aggressive') === true)
                valueType = 'Distinct';
            else if (this.get('client.nada.aggressive') === false && this.get('client.nada.off') === false)
                valueType = 'Raw';
            else
                valueType = false;

            console.log('Updating Makes', {y: year});

            if (valueType !== false) {
                $.ajax({
                    url: 'module/VehicleData/'+ valueType +'/'+ year,
                    type: 'get',
                    // dataType: 'json',
                    success: function (data) {
                        console.log('Updated Makes', data);
                        if (typeof data === 'string')
                            data = JSON.parse(data);
                        
                        makes = data;

                        console.log('makes', makes);
                        self.set('nada.makes', makes);
                    },
                    error: function (e) {
                        console.error(e.message);
                    }
                });
            }
        },

        updateModels: function () {
            var
            self = this,
            valueType,
            year = this.get('vehicle.year'),
            make = this.get('vehicle.make'),
            models = [];

            this.set('vehicle.mileage', ''); // Reset vehicle mileage to force the user to input it

            if (this.get('client.nada.aggressive') === true)
                valueType = 'Distinct';
            else if (this.get('client.nada.aggressive') === false && this.get('client.nada.off') === false)
                valueType = 'Raw';
            else
                valueType = false;

            console.log('Updating Models', {y: year, mk: make});

            if (valueType !== false) {
                $.ajax({
                    url: 'module/VehicleData/'+ valueType +'/'+ year +'/'+ make,
                    type: 'get',
                    // dataType: 'json',
                    success: function (data) {
                        console.log('Updated Models', data);
                        
                        if (typeof data === 'string')
                            data = JSON.parse(data);

                        models = data;

                        console.log('models', models);
                        self.set('nada.models', models);
                    },
                    error: function (e) {
                        console.error(e.message);
                    }
                });
            }
        },

        updateTrims: function () {
            var
            self = this,
            year = this.get('vehicle.year'),
            make = this.get('vehicle.make'),
            model = this.get('vehicle.model'),
            trims = [];

            console.log('Updating Trims', {year: year, make: make, model: model});

            $.ajax({
                url: 'module/VehicleData/Raw/'+ year +'/'+ make +'/'+ model,
                type: 'get',
                // dataType: 'json',
                success: function (data) {
                    console.log('Updated Trims', data);
                    
                    if (typeof data === 'string')
                        data = JSON.parse(data);

                    trims = data;

                    console.log('trims', trims);
                    self.set('nada.trims', trims);
                },
                error: function (e) {
                    console.error(e.message);
                }
            });
        },

        updateValue: function () {
            var
            value,
            basis,
            valueType,
            self = this,
            year = this.get('vehicle.year'),
            make = this.get('vehicle.make'),
            model = this.get('vehicle.model'),
            mileage = this.get('vehicle.mileage');

            if (this.get('client.nada.aggressive') === true)
                valueType = 'Distinct';
            else if (this.get('client.nada.aggressive') === false && this.get('client.nada.off') === false)
                valueType = 'Raw';
            else
                valueType = false;

            console.log('Updating Value', {y: year, mk: make, md: model, mi: mileage});

            if (valueType === 'Distinct') {
                $.ajax({
                    url: 'module/VehicleData/'+ valueType +'/'+ year +'/'+ make +'/'+ model,
                    type: 'get',
                    // dataType: 'json',
                    success: function (data) {
                        if (typeof data === 'string')
                            data = JSON.parse(data);

                        console.log('Updated Aggressive Value', data);
                        
                        value = Number(data.value);
                        basis = data.basedOn;

                        self.set('vehicle.value', value);
                        self.set('vehicle.basedOn', basis);
                        self.set('customer.vehicle.value', value);
                        self.set('customer.vehicle.basedOn', basis);
                        self.set('customer.CustomerYearMakeModel', year +' '+ make +' '+ model);
                        
                        $('#value').val(value);
                    },
                    error: function (e) {
                        console.error(e.message);
                    }
                });
            } else if (valueType === 'Raw') {
                var
                trim = this.get('vehicle.trim'),
                condition = this.get('vehicle.condition');

                $.ajax({
                    url: 'module/VehicleData/'+ valueType +'/'+ year +'/'+ make +'/'+ model +'/'+ trim +'/'+ condition,
                    type: 'get',
                    // dataType: 'json',
                    success: function (data) {
                        if (typeof data === 'string')
                            data = JSON.parse(data);

                        console.log('Updated Raw Value', data);
                        
                        value = Number(data.value);
                        basis = data.basedOn;

                        self.set('vehicle.value', value);
                        self.set('vehicle.basedOn', basis);
                        self.set('customer.vehicle.value', value);
                        self.set('customer.vehicle.basedOn', basis);
                        self.set('customer.CustomerYearMakeModel', year +' '+ make +' '+ model);
                        
                        $('#value').val(value);
                    },
                    error: function (e) {
                        console.error(e.message);
                    }
                });
            }
        },

        render: function(){
            return Mustache.render(this.template, this.get());
        },
        validation: {}
    });

    return QuestionsApp;
    
});