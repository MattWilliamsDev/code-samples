define([
    'jquery',
    'Ractive',
    'Director',
    'Mail',
    'Form',
    'Validate',
    'ValidateMethods',
    'modules/infobar',
    'modules/feed',
    'modules/header',
    'modules/footer',
    'modules/winners',
    'modules/questions',
    'modules/terms',
    'modules/verify',
    'modules/confirmation',
    'Bootstrap',
    'moment-timezone',
    'moment-timezone-data',
    '../helpers',
    'Vegas'
], function(
    $,
    Ractive,
    Router,
    MailApp,
    AjaxForm,
    Validate,
    ValidateMethods,
    InfoBarView,
    FeedView,
    HeaderView,
    FooterView,
    WinnersView,
    QuestionsView,
    TermsView,
    VerifyView,
    ConfirmationView,
    /*FWMail,*/
    Bootstrap,
    moment,
    tzData,
    Helpers,
    Vegas
) {

    // 'use strict';
    
    var
    client = window.client || {},
    customer = window.customer || {},

    App = {
        CreditUrlBase: 'http://beta.getfastcredit.com/fw_mail.php',
        CreditUrl: '',
        client: client,
        customer: customer,
        init: function (job, purl) {
            console.log('Running init!', {job: job, purl: purl, client: client, customer: customer, route: route, guid: guid });

            if (window.location.hash === '') {
                window.location.hash = '/';
            }
            
            try {
                App.Router = new Router(routes).configure(routeOptions);
            } catch (e) {
                console.error(e.message);
            }

            App.job = job;
            App.purl = purl;
            App.Router.init();
            if(route) {
                App.Router.setRoute(route);
            }

            App.InfoBar = new InfoBarView({
                data: {
                    client: client
                }
            });

            App.Feed = new FeedView({
                data: {
                    job: job,
                    stats: {
                        contests: '3,372',
                        participants: '1,334,584',
                        progressive: Number('6750.04').toCurrency(),
                        awarded: Number('3682591.03').toCurrency()
                    }
                }
            });
            
            App.Header = new HeaderView({
                data: {
                    customer: {
                        fname: customer.CustomerFirstNameChange || customer.CustomerFirstName,
                        lname: customer.CustomerLastNameChange || customer.CustomerLastName
                    },
                    ribbon: {
                        img: 'placeholder.jpg', // Image Name
                        banner: '#ff7107' // Banner Hex Color
                    }
                }
            });
            
            App.Footer = new FooterView({
                data: {
                    client: client,
                    clientName  : client.name,
                    clientPhone : client.phone,
                    clientWebsite : client.website,
                    clientAddress : {
                        street: client.address.address,
                        city: client.address.city,
                        state: client.address.state,
                        zip: client.address.zip
                    }, 
                }
            });

            App.Terms = new TermsView({
                data: {
                    termsLink : ''
                }
            });


            App.Winners = new WinnersView({
                data: {
                    winners : [
                        {
                            first: client.recentwinners[0].first,
                            last: client.recentwinners[0].last, 
                            image: client.recentwinners[0].pic || 'img/fwmail/silhouette.png',
                            city: client.recentwinners[0].city,  
                            state: client.recentwinners[0].state,
                            prize: client.recentwinners[0].prize,
                        },
                        {
                            first: client.recentwinners[1].first,
                            last: client.recentwinners[1].last, 
                            image: client.recentwinners[1].pic || 'img/fwmail/silhouette.png',
                            city: client.recentwinners[1].city,  
                            state: client.recentwinners[1].state,
                            prize: client.recentwinners[1].prize,
                        },
                        {
                            first: client.recentwinners[2].first,
                            last: client.recentwinners[2].last, 
                            image: client.recentwinners[2].pic || 'img/fwmail/silhouette.png',
                            city: client.recentwinners[2].city,  
                            state: client.recentwinners[2].state,
                            prize: client.recentwinners[2].prize,
                        },
                        {
                            first: client.recentwinners[3].first,
                            last: client.recentwinners[3].last, 
                            image: client.recentwinners[3].pic || 'img/fwmail/silhouette.png',
                            city: client.recentwinners[3].city,  
                            state: client.recentwinners[3].state,
                            prize: client.recentwinners[3].prize,
                        },
                        {
                            first: client.recentwinners[4].first,
                            last: client.recentwinners[4].last, 
                            image: client.recentwinners[4].pic || 'img/fwmail/silhouette.png',
                            city: client.recentwinners[4].city,  
                            state: client.recentwinners[4].state,
                            prize: client.recentwinners[4].prize,
                        },
                        {
                            first: client.recentwinners[5].first,
                            last: client.recentwinners[5].last, 
                            image: client.recentwinners[5].pic || 'img/fwmail/silhouette.png',
                            city: client.recentwinners[5].city,  
                            state: client.recentwinners[5].state,
                            prize: client.recentwinners[5].prize,
                        },
                    ]
                }
            });
            
            /**
             * Add Custom Validation Methods and Set Custom Defaults
             */
            if ($.validator) {
                // $.validator.setDefaults({
                //     errorPlacement: function(error, element) {
                //         console.log('Running Custom ErrorPlacement', {er: error, el: element});
                //         if (element.attr('type') === 'radio')
                //             error.appendTo('.error-message label.error[for='+ element.attr('id')+ ']');
                //         else
                //             error.insertAfter(element.prev());
                //     }
                // });

                $.validator.addMethod('validCode', function (value, el, arg) {
                    var
                    result,
                    code = App.client.verifycode || window.client.verifycode;
                    result = (code == value);
                    return result == arg; // make sure it is equal to the specified boolean
                });

                var originalDateValidator1 = $.validator.methods.date;
                var originalDateValidator2 = $.validator.methods.dateISO;

                $.validator.methods.date = function (value, element) {
                    var isValidDate =
                        originalDateValidator1.apply(this, arguments) ||
                        originalDateValidator2.apply(this, arguments);

                    return isValidDate;
                };
            }

            $(function () {

                window.App = App;
                
                $(document).on({
                    teardown: function (e, view) {
                        if (typeof view !== 'undefined')
                            App[view].teardown();
                    },
                    saveTrack: function(e, options) {
                        console.log('Insert Track');
                        $.ajax({
                            url: 'Customer/Track/' + customer.jobs_no + '/' + customer.CustomerKey + '/' + options.hash + '/' + guid,
                            success: function (data) {
                                console.log('Saved Track', data);
                            },
                            error: function (e) {
                                console.error(e.message);
                            }
                        });
                    },
                    saveSuccessful: function (e, options) {
                        console.log('SaveSuccessful Options', options);
                        window.customer = options.response;

                        try {
                            App.Header.fire('update.customer', options);
                            App.Winners.fire('update.customer', options);
                            App.Content.fire('update.customer', options);
                            App.Footer.fire('update.customer', options);
                        } catch (error) {
                            console.error('Error:', error.message);
                        }
                        App.Router.setRoute(options.hash);
                    },
                    "update.customer": function (e, options) {
                        var
                        attr = options.attr,
                        value = options.val;
                        
                        console.log('update.customer listener options (header)', options);

                        try {
                            App.Header.fire('update.customer', options);
                            App.Winners.fire('update.customer', options);
                            // App.Content.fire('update.customer', options);
                            App.Footer.fire('update.customer', options);
                        } catch (error) {
                            console.error('Error:', error.message);
                        }

                        if (attr === 'code' || attr === 'inputCode') {
                            // console.log('value == verifycode?', {attr: attr, options: options, value: value, code: App.client.verifycode});
                            if (value == App.client.verifycode) {
                                console.log('Firing App.Feed.verified');
                                App.Feed.fire('verified', App.Content.get('customer'));
                                App.Winners.fire('verified', App.Content.get('customer'));
                            }
                        }
                    },
                    "update.lead": function (e, options) {
                        console.log('Firing update.lead', options);
                        App.CreditUrl = App.CreditUrlBase +'?k='+ options.key +'&d='+ options.date;
                        try {
                            App.Content.fire('updateLead', options);
                        } catch (error) {
                            console.error(error.message);
                        }
                        console.log('App.CreditUrl Set', App.CreditUrl);
                    }
                });

                App.Header.on('update.customer', function (options) {
                    // console.log('HeaderView Update.customer Listener', {opt: options});
                    var attr = 'customer.' + options.attr;
                    this.set(attr, options.value);
                });

                App.Feed.on({
                    verified: function (customer) {
                        console.log('customer', new Date().getTime());
                        var
                        time = Math.round(+new Date()/1000),
                        display = {
                            fname: customer.CustomerFirstNameChange || customer.CustomerFirstName,
                            lname: customer.CustomerLastNameChange || customer.CustomerLastName,
                            city: customer.CustomerCity,
                            state: customer.CustomerState,
                            time: moment(time),
                            type: 'won'
                        };
                        console.log('App.Feed.on.verified().display', display);
                        App.Feed.updateDisplayed(display);
                    }
                });

                App.Winners.on({
                    'update.customer': function (options) {
                        // console.log('WinnersView Update.customer Listener', {options: options});
                        var attr = 'customer.' + options.attr;
                        this.set(attr, options.value);
                    },
                    verified: function (options) {
                        // console.log('App.Winners.Verified Options', options);
                        var winner = {
                            image: 'img/fwmail/silhouette.png',
                            first: options.CustomerFirstNameChange || options.CustomerFirstName,
                            last: options.CustomerLastNameChange || options.CustomerLastName,
                            city: options.CustomerCity,
                            state: options.CustomerState,
                            prize: '?'
                        };
                        App.Winners.replaceWinner(winner);
                    }
                });

                App.Content.on({
                    'update.customer': function (data) {
                        console.log('App.Content.on(udate.customer) data', data);
                        // this.set('customer', customer);
                    }
                });

                App.Footer.on('update.customer', function (options) {
                    // console.log('FooterView Update.customer Listener', {options: options});
                    var attr = 'customer.' + options.attr;
                    this.set(attr, options.value);
                });

            });

            //insert initial timing record
            if(route) {
                var timingPanel = 'startq';
            } else {
                var timingPanel = 'start'
            }
            console.log('Insert Track');
            $.ajax({
                url: 'Customer/Track/' + customer.jobs_no + '/' + customer.CustomerKey + '/' + timingPanel + '/' + guid,
                success: function (data) {
                    console.log('Saved Track', data);
                },
                error: function (e) {
                    console.error(e.message);
                }
            });
        },
        
        index: function () {
            var mailApp = new MailApp({
                data: {
                    code: '',
                    customer: customer,
                    fname: customer.CustomerFirstNameChange || customer.CustomerFirstName,
                    lname: customer.CustomerLastNameChange || customer.CustomerLastName,
                    city: customer.CustomerCityChange || customer.CustomerCity,
                    state: customer.CustomerStateChange || customer.CustomerState,
                    email: customer.CustomerEmail,
                    client: client,
                    clientName  : client.name,
                    clientPhone : client.phone,
                    clientWebsite : client.website,
                    clientAddress : {
                        street: client.address.address,
                        city: client.address.city,
                        state: client.address.state,
                        zip: client.address.zip
                    },
                },
                validation: App.validation.inputCode
            });

            mailApp.observe('code', function (newVal, oldVal) {
                console.log('Changing Input Code', newVal);
                this.data.code = newVal;
                $(document).trigger('update.customer', {attr: 'code', val: newVal});
            });

            mailApp.on({
                submit: function () {
                    console.log('mailApp.submit event');
                    this.verify('#inputCode');

                    $(this).ajaxSubmit({
                        complete: function (xhr, status, $el) {
                            console.log('AjaxSubmit Complete', {
                                status: status,
                                xhr: xhr,
                                $el: $el
                            });
                        }
                    });
                },
                register: function () {
                    App.Router.setRoute('verifyCode');
                },
                verify: function () {
                    this.verify('#inputCode')
                }
            });

            App.Content = mailApp;

            $(function () {
                var img = '<img src="img/fwmail/fw_logo.png" />';
                $("#codepop").popover({ content: img, html:true, trigger: 'hover' });

            }); 

            $(function () {

                App.buildForms('#inputCode-form', App.Content);
                
                $(document).on({
                    saveSuccessful: function (options) {
                    },
                    "update.customer": function (e, options) {
                        var
                        resp,
                        attr = options.attr,
                        value = options.value;
                        
                        if (typeof options.response !== 'undefined')
                            resp = options.response;
                        else
                            resp = options;

                        try {
                            App.Content.fire('update.customer', resp || options);
                        } catch (error) {
                            console.error('Error:', error.message);
                        }
                    }
                });

            });
        },

        verifyPage: function (pageId) {
            var verifyView = new VerifyView({
                data: {
                    customer: customer,
                    fname: customer.CustomerFirstNameChange || customer.CustomerFirstName,
                    lname: customer.CustomerLastNameChange || customer.CustomerLastName,
                    city: customer.CustomerCityChange || customer.CustomerCity,
                    state: customer.CustomerStateChange || customer.CustomerState,
                    phone: customer.CustomerPhone,
                    email: customer.CustomerEmail,
                    client: client,
                    clientName  : client.name,
                    clientPhone : client.phone,
                    clientWebsite : client.website,
                    clientAddress : {
                        street: client.address.address,
                        city: client.address.city,
                        state: client.address.state,
                        zip: client.address.zip
                    },
                    displayImage: client.displayprize != 'null' ? client.displayprize : 'img/fwmail/silhouette.png',
                    collageImage: client.prizes.collageimage, 
                    defaultImage: client.prizes.defaultPrize.image,
                    defaultName: client.prizes.defaultPrize.name,
                },
            });
            App.Content = verifyView;

            verifyView.on({ 
                navigate: function(e,$el){
                    console.log(e);
                    $(document).trigger('saveTrack', {
                        el: $el,
                        hash: $('button', $el).attr('href')
                    }); 
                    App.Router.setRoute($('#navButton').attr('href'));
                },
                update: function (e) {
                    console.log('VerifyView Update Listener', e);
                }
            });

            $(function () {
                
                App.buildForms('#verifyCode-form', App.Content);

                $(document).on({
                    saveSuccessful: function (options) {                      
                    },
                    "update.customer": function (e, options) {
                        var
                        attr = options.attr,
                        value = options.value;
                        
                        // try {
                        //     App.Content.fire('update.customer', options);
                        // } catch (error) {
                        //     console.error('Error:', error.message);
                        // }
                    }
                });

            });
        },

        viewPage: function (pageId) {
            var pageView = new QuestionsView({
                data: {
                    grandPrize: {
                        prizes: [
                            { name: '$100,000 Cash Giveaway', status: 'unselected', selected: false },
                            { name: 'His &amp; Her Vehicles', status: 'unselected', selected: false }
                        ],
                        input: 'prize'
                    },
                    customer: customer,
                    fname: customer.CustomerFirstNameChange || customer.CustomerFirstName,
                    lname: customer.CustomerLastNameChange || customer.CustomerLastName,
                    phone: customer.CustomerPhone,
                    email: customer.CustomerEmail,
                    // timeframe: '',
                    // newUsed: '',
                    client: client,
                    clientName  : client.name,
                    clientPhone : client.phone,
                    clientWebsite : client.website,
                    clientAddress : {
                        street: client.address.address,
                        city: client.address.city,
                        state: client.address.state,
                        zip: client.address.zip
                    },
                    vehicle : {
                        year: '',
                        make: '',
                        model: '',
                        trim: '',
                        condition: '',
                        mileage: '',
                        value: ''
                    },
                },
                validation: App.validation.questions
            });

            pageView.observe({
                fname: function (newVal, oldVal) {
                    var attr = 'fname';
                    this.data.fname = newVal;
                    $(document).trigger('update.customer', {attr: attr, value: newVal});
                },
                lname: function (newVal, oldVal) {
                    var attr = 'lname';
                    this.data.lname = newVal;
                    $(document).trigger('update.customer', {attr: attr, value: newVal});
                },
                email: function (newVal, oldVal) {
                    var attr = 'email';
                    this.data.email = newVal;
                    $(document).trigger('update.customer', {attr: attr, value: newVal});
                },
                phone: function (newVal, oldVal) {
                    // This doesn't want to update the formatted value for some reason
                    var newPhone = this.formatPhone(newVal);
                    var attr = 'phone';
                    this.data.phone = newPhone;
                    $(document).trigger('update.customer', {attr: attr, value: newPhone});
                },
                timeframe: function (newVal, oldVal) {
                    var attr = 'timeframe';
                    this.data.timeframe = newVal;
                    $(document).trigger('update.customer', {attr: attr, value: newVal});
                    $("#nadapop").popover({ content: 'The National Automotive Dealers Association is an organization dedicated to the federal representation, research, and improvement of dealerships both domestically and internationally.', trigger: 'hover', placement: 'left', html: true });

                },
                newUsed: function (newVal, oldVal) {
                    var attr = 'newUsed';
                    $(document).trigger('update.customer', {attr: attr, value: newVal});
                },
                year: function (newVal, oldVal) {
                    var uri, attr = 'year';
                    this.data.vehicle[attr] = newVal;
                    this.data.customer.tcusquestions_year = newVal;
                    $(document).trigger('update.customer', {attr: attr, value: newVal});
                },
                make: function (newVal, oldVal) {
                    var attr = 'make';
                    this.data.vehicle[attr] = newVal;
                    this.data.customer.tcusquestions_make = newVal;
                    $(document).trigger('update.customer', {attr: attr, value: newVal});
                },
                model: function (newVal, oldVal) {
                    var attr = 'model';
                    this.data.vehicle[attr] = newVal;
                    this.data.customer.tcusquestions_model = newVal;
                    $(document).trigger('update.customer', {attr: attr, value: newVal});
                },
                trim: function (newVal, oldVal) {
                    var attr = 'trim';
                    this.data.vehicle[attr] = newVal;
                    this.data.customer.tcusquestions_trim = newVal;
                    $(document).trigger('update.customer', {attr: attr, value: newVal});
                },
                condition: function (newVal, oldVal) {
                    var attr = 'condition';
                    this.data.vehicle[attr] = newVal;
                    $(document).trigger('update.customer', {attr: attr, value: newVal});
                },
                mileage: function (newVal, oldVal) {
                    var attr = 'mileage';
                    this.data.vehicle[attr] = newVal;
                    $(document).trigger('update.customer', {attr: attr, value: newVal});
                },
                value: function (newVal, oldVal) {
                    console.log('VALUE CHANGED', newVal);
                    var attr = 'value';
                    this.data.vehicle[attr] = newVal;
                    this.data.customer.tcusquestions_value = newVal;
                    $(document).trigger('update.customer', {attr: attr, value: newVal});
                },
                apptDate: function (newVal, oldVal) {
                    var attr = 'apptDate';
                    $(document).trigger('update.customer', {attr: attr, value: newVal});
                    console.log('Changing' + attr, {n: newVal, o: oldVal});
                },
                apptTime: function (newVal, oldVal) {
                    var attr = 'apptTime';
                    $(document).trigger('update.customer', {attr: attr, value: newVal});
                    console.log('Changing' + attr, {n: newVal, o: oldVal});
                }
            });

            pageView.on({
                'update.customer': function (options) {
                    console.log('Page View Updating', options);
                    var
                    response,
                    self = this;

                    if (typeof options.response === 'string') {
                        response = JSON.parse(options.response);
                    }

                    $.each(response, function (key, value) {
                        // console.log('each option to save', {k: key, v: value, attr: 'customer.'+ key});
                        self.set('customer.' + key, value);
                    });
                },
                setTimeframe: function (e) {
                    // console.log('setTimeframe', e.node.value);
                    this.set('timeframe', e.node.value);
                },
                setNewUsed: function (e) {
                    this.set('newUsed', e.node.value);
                },
                setApptDate: function (e) {
                    this.set('appt.date', e.node.value);
                },
                setApptTime: function (e) {
                    this.set('appt.time', e.node.value);
                },
                setYear: function (e, val) {
                    console.log('NADA Event', e);
                    this.set('vehicle.year', e.node.value);
                    this.set('customer.tcusquestions_year', e.node.value);
                    this.updateMakes();
                },
                setMake: function (e) {
                    console.log('NADA Event', e);
                    this.set('vehicle.make', e.node.value);
                    this.set('customer.tcusquestions_make', e.node.value);
                    this.updateModels();
                },
                setModel: function (e) {
                    console.log('NADA Event', e);
                    this.set('vehicle.model', e.node.value);
                    this.set('customer.tcusquestions_model', e.node.value);
                    
                    if (this.get('client.nada.aggressive') === false && this.get('client.nada.off') === false)
                        this.updateTrims();
                },
                setTrim: function (e) {
                    console.log('NADA Event', e);
                    this.set('vehicle.trim', e.node.value);
                },
                setCondition: function (e) {
                    console.log('NADA Event', e);
                    this.set('vehicle.condition', e.node.value);
                },
                setMileage: function (e) {
                    console.log('NADA Event', e);
                    this.set('vehicle.mileage', e.node.value);
                    this.updateValue();
                },
                setValue: function (e) {
                    console.log('NADA Event - Changed Value', e);
                    this.set('vehicle.value', e.node.value);
                    this.set('customer.tcusquestions_value', e.node.value);

                    var
                    vehicle,
                    year,
                    make,
                    model;

                    this.set('customer.tcusquestions_vehicle', vehicle);
                },
                select: function (e) {
                    var
                    unselected = {},
                    index = e.index.i,
                    $node = $(e.node);

                    if (index === 0) {
                        unselected.index = 1;
                    } else {
                        unselected.index = 0;
                    }

                    this.selectPrize(index, unselected.index);
                },
                setLead: function (e) {
                    this.setLead(customer.CustomerKey);
                    $('#questions-form').submit();
                },
                submit: function (e) {
                    console.log('Submit Proxy');
                    $('#questions-form').ajaxSubmit();
                }
            });

            App.Content = pageView;

            $(function () {
                // Tear down the winners feed on the registration page
                if (typeof App.Winners !== 'undefined')
                    App.Winners.fire('teardown');

                App.buildForms('#questions-form', App.Content);

                /* if user is directed first to questions, insert purl hit */
                if(route) {
                    console.log('Marking Redeemed');
                    $.ajax({
                        url: 'Prize/Update/' + customer.jobs_no + '/' + customer.CustomerKey + '/' + route,
                        success: function (data) {
                            console.log('Redeemed Data', data);
                        },
                        error: function (e) {
                            console.error(e.message);
                        }
                    });
                }

                $(document).on({
                    saveSuccessful: function (options) {   
                    },
                    "update.customer": function (e, options) {
                        var
                        attr = options.attr,
                        value = options.value;

                        // try {
                        //     App.Content.fire('update.customer', options);
                        // } catch (error) {
                        //     console.error('Error:', error.message);
                        // }
                    }
                });

                $(document).trigger('teardown', 'Winners');
            });
        },

        confirmationPage: function () {
            // console.log('This would normally navigate to "#/confirmation" now.');
            var confirmationView = new ConfirmationView({
                data: {
                    customer: customer,
                    client: client
                }
            });

            App.Content = confirmationView;

            console.log('Running Confirmation Page', {app: App.CreditUrl, this: App.Content.get('creditUrl')});
            if (App.Content.get('creditUrl') !== App.CreditUrl) {
                App.Content.set('creditUrl', App.CreditUrl);
            }

            confirmationView.on({ 
                // 'credit.modal': function (e) {
                //     console.log('credit.modal fired', e);
                // },
                updateLead: function (options) {
                    console.log('Updating Lead', options);
                    var
                    url,
                    key = options.key,
                    date = options.date,
                    // key = this.get('customer.CustomerKey'),
                    // date = this.get()
                    base = this.get('creditUrl');

                    url = base +'?k='+ key +'&d='+ date;
                    this.set('creditUrl', url);
                },
                navigate: function (e) {
                    console.log(e);
                    App.Router.setRoute($('#navButton').attr('href'));
                },
                update: function (e) {
                    console.log('VerifyView Update Listener', e);
                }
            });

            $(function () {
                $(document).on({
                    saveSuccessful: function (options) {                       
                    },
                    "update.customer": function (e, options) {
                        // var
                        // attr = options.attr,
                        // value = options.value;
                        
                        // console.log('update.customer listener options (index view)', options);

                        // try {
                        //     App.Content.fire('update.customer', options);
                        // } catch (error) {
                        //     console.error('Error:', error.message);
                        // }
                    }
                });
            });
        },

        buildForms: function (selector, view) {
            console.log('Running buildForms()', {sel: selector, view: view});
            var
            valid,
            validator,
            $self = $(selector),
            validation = {
                options: {},
                selector: $self.data('voptions')
            };
            
            if (typeof validation.selector !== undefined)
                validation.options = App.validation[validation.selector];

            validator = $self.validate(validation.options);

            console.log('validator', validator);
            
            try {
                $(selector).ajaxForm({
                    url: 'module/Mail/Customer/Save/' + App.customer.CustomerKey,
                    type: 'post',
                    // dataType: 'json',
                    beforeSubmit: function (arr, $form, options) {
                        /**
                         *  Form data array is an array of objects with name and value properties
                         *  Ex: [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
                         */
                        
                        // Run the validation
                        try {
                            // Check if valid
                            result = $(selector).valid();
                        } catch (error) {
                            console.error('Error:', error.message);
                        }

                        console.log('validation result', {
                            result: result,
                            vOptions: validation.options,
                            options: options,
                            arr: arr,
                            form: $(selector),
                            validator: validator,
                            valid: $(selector).valid()
                        });

                        if (result === true) {
                            // Form is VALID
                            $(selector).removeClass('invalidated').addClass('validated');
                        } else {
                            // Form is INVALID
                            $(selector).removeClass('validated').addClass('invalidated');
                        }

                        // Return false to cancel submit
                        return result;
                    },
                    success: function (response, status, xhr, $el) {
                        console.log('Submit Success', {
                            // response: JSON.parse(response),
                            response: response,
                            status: status,
                            xhr: xhr,
                            $el: $el
                        });

                        // if (typeof response === 'string') {
                        //     response = JSON.parse(response);
                        // }

                        successful = response;
                        // if (formId === '')

                        $(document).trigger('saveSuccessful', {
                            response: successful,
                            el: $el,
                            hash: $('button', $el).attr('href')
                        });
                        $(document).trigger('saveTrack', {
                            el: $el,
                            hash: $('button', $el).attr('href')
                        }); 

                    },
                    error: function (e) {
                        console.error(e.message);
                    }
                });
            } catch (e) {
                console.error(e.message);
            }

            $('input:first', selector).focus();
            // $('input, select, textarea', selector).each(function (idx) {
            //     $(this).focus();
            //     $(this).blur();
            //     if (idx == $('input, select, textarea', selector).length - 1)
            //         $('input:first', selector).focus();
            // });

            $(selector).on({
                submit: function (e, $el) {
                    console.log('Submitted from buildForms Listener', e);
                    // console.log('button',$('button[type=submit]', selector));               
                    App.Content.fire('submit');
                    e.preventDefault();
                    
                    return false;
                }
            });
        },

        validation: {
            inputCode:{
                rules: {
                    inputCode: {
                        required: true,
                        validCode: true
                    }
                },
                messages: {
                    inputCode: {
                        required: 'Please enter your code',
                        validCode: "Oops! We can't find you in our database. Check your code and try again or <a href=\"mailto:support@fatwin.com\">contact support</a>"
                    }
                },
                focusCleanup: true,
                // errorClass: 'has-error',
                // validClass: 'has-success',
                ignore: 'ignore'
            },
            questions: {
                messages: {
                    prize: 'Please choose a prize',
                    fname: 'Please enter your first name',
                    lname: 'Please enter your last name',
                    email: 'Please enter your email address',
                    phone: {
                        required: 'Please enter your phone #',
                        phoneUS: 'Please enter a valid phone #'
                    },
                    timeframe: 'Please select an option',
                    newUsed: 'Please select an option'
                },
                rules: {
                    prize: 'required',
                    fname: 'required',
                    lname: 'required',
                    email: {
                        required: true,
                        email: true
                    },
                    phone: {
                        required: false,
                        phoneUS: true
                    },
                    timeframe: 'required',
                    newUsed: 'required'
                },
                focusCleanup: true,
                errorElement: 'div',
                // errorClass: 'has-error',
                // validClass: 'has-success',
                ignore: 'ignore'
            }
        }
    },
    
    routes = {
        '/': App.index,
        '/verify': App.verifyPage,
        '/verifyCode': App.verifyPage,
        '/questions': App.viewPage,
        '/confirmation': App.confirmationPage,
        '/complete': App.confirmationPage,
        '/page/:pageId': App.viewPage,
        '/view/:pageId': App.viewPage
    },

    routeOptions = {
        after: function () {
            var route = App.Router.getRoute();
            console.log('Route:after options', route);


            /** 
             * Do a little cleanup work.
             * Tear down our content when we navigate away from a route.
             */
            App.Content.teardown();
        }
    };

    return App;
});