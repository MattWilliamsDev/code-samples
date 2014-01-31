define([
    // Scripts
    'Ascensor',
    'Ractive',
    'Validate',
    'ValidateMethods',
    'moment',
    'WinnersFeed',
    'Currency',
    'Mustache',
    'nprogress',
    'Form',
    'Easing',
    
    // Modules
    // 'events',
    'Compatibility',
    'Client',
    'Internal',
    'Panels',
    'User',
    'Scrollbars',
    'SpinCounter',
    'fb',
    //'gplus',
    'myTwitter',
    'myGplus',
    'WinnersFeed',

    //browser
    'tyBrowser',

    // Templates
    'rv!TPL/widgets/spin-counter',
    'text!TPL/index.html',
    'text!TPL/missionControl/index.html',
    'text!TPL/winnersFeed/index.html',
    'text!TPL/panels/intro.html',
    'text!TPL/panels/registration.html',
    'text!TPL/panels/already-played.html',
    'text!TPL/panels/question.html',

    // Modals
    'text!TPL/modals/regulations.html',
    'text!TPL/modals/privacy-policy.html',
    'text!TPL/modals/officalrules.html',
    'text!TPL/modals/nada-details.html',

    'text!TPL/panels/share.html',
    'text!TPL/panels/nada.html',
    'text!TPL/panels/appointment.html',
    'text!TPL/panels/info.html',
    'text!TPL/panels/game.html'
    // 'text!TPL/panels/question-container.html'
], function (
    // Scripts
    ascensor,
    Ractive,
    Validate,
    ValidateMethods,
    moment,
    WinnersFeed,
    Currency,
    Mustache,
    nprogress,
    AjaxForm,
    Easing,
    
    // Modules
    // Events,
    Compatibility,
    Client,
    Internal,
    Panels,
    User,
    Scrollbars,
    SpinCounter,
    fb,
    //gplus,
    myTwitter,
    myGplus,
    Feed,

    tyBrowser,

    // Templates
    SpinCounterTpl,
    MainTpl,
    MissionCtrlTpl,
    FeedTpl,
    IntroTpl,
    RegisterTpl,
    AlreadyPlayedTpl,
    QuestionTpl,
    RegulationsTpl,
    PrivacyPolicyTpl,
    RulesTpl,
    NadaDetailsTpl,

    ShareTpl,
    NadaTpl,
    ApptTpl,
    ThanksTpl,
    GameTpl
){

    // 'use strict';
    var
    client,
    user,
    hasShared = 0,
    defaultShareImage = 'img/pink_ribbon.png',
    questionPanels = [],
    App = {
        initializer: function (callback){
            client = new Client(window.currentJob),            
            user = User.init({
                job: window.currentJob,
                share: window.share,
                gurl: window.gurl,
                deferred: true
            });

            this.User = user;
            this.Client = client;

            if (typeof callback === 'function')
                callback.call(this, arguments);

            return this;
        }
    };

    App.initializer(function () {
        console.log('initializer callback', App);
    });

    var appointmentQuestionPanel = {
        floorName   : 'appointment',
        template    : ApptTpl,
        qIndex      : 0,
        type        : 'input',
        header      : "Schedule an appointment",
        subhead     : 'Would you like to setup an appointment to speak with us?',
        denote      : 'You will not lose your extra spins by declining to answer',
        fields      : [
            { 
                name        : 'apptDate',
                type        : 'date',
                label       : false,
                datepicker  : true,
                options     : [],
                valid       : false,
                unvalidated : true,
                value       : ''
            },
            {
                name        : 'apptTime',
                type        : 'select',
                label       : false,
                datepicker  : false,
                options     : [],
                valid       : false,
                unvalidated : true,
                value       : ''
            }
        ],
        unvalidated : true,
        valid       : false,
        options     : {
            messages    : {
                apptDate: {
                    required: "Please choose an appointment date",
                    date: "Please choose a valid appointment date"
                },
                apptTime: "Please choose an appointment time"
            },
            rules       : {
                apptDate: {
                    required: false,
                    date: true
                },
                apptTime: {
                    required: false,
                    valueNotEquals: function () {
                        var def;
                        if (appointmentQuestionPanel.options.rules.apptDate.required === true)
                            def = 'default';
                        else
                            def = false;

                        return def;
                    }
                }
            }
        },
        spins: {
            added: false,
            count: 0,
            display: 0
        }
    };

    var nadaQuestionPanel = {
        floorName   : 'nada-value',
        template    : NadaTpl,
        qIndex      : 0,
        type        : 'nada',
        header      : 'What type of vehicle are you currently driving?',
        subhead     : 'Let us know and get an estimated trade-in value for your vehicle!',
        denote      : false,
        estVisible  : false,
        fields      : {
            year: {
                label: 'Year',
                name: 'year',
                type: 'select',
                placeholder: 'Year',
                getOptions: function (){
                    var options = [], start = (new Date().getFullYear()) + 1, end = 1985, i;

                    for (i = start; i >= end; i--){
                        var option = {};
                        option.value = i;
                        option.label = i;
                        options.push(option);
                    }

                    return options;
                },
                active: true,
                required: true,
                value: '',
                valid: false,
                unvalidated : true,
            },
            make: {
                label: 'Make',
                name: 'make',
                type: 'select',
                placeholder: 'Make',
                renderOptions: function (options){
                    var self = this;
                    $.each(options, function (k){
                        var opt = $('<option/>');
                        opt.val(this.value).html(this.label);
                        $('#' + self.name).append(opt);
                    });
                },
                getOptions: function (year){
                    var options = [];
                    var self = this;

                    if (!year){
                        year = $('#year option:selected').val();
                    }

                    $.ajax({
                        url: 'module/VehicleData/Distinct/' + year,
                        success: function (data){
                            var json = $.parseJSON(data);

                            for (var i = 0; i < json.length; i++){
                                var option = {
                                    value: json[i],
                                    label: json[i]
                                }
                                options.push(option);
                            }

                            self.renderOptions(options);
                            return options;
                        }
                    });

                    return options;
                },
                active: true,
                required: true,
                value: '',
                valid: false,
                unvalidated : true,
            },
            model: {
                label: 'Model',
                name: 'model',
                type: 'select',
                placeholder: 'Model',
                active: true,
                required: true,
                value: '',
                valid: false,
                unvalidated : true,
            },
            value: {
                type: 'hidden',
                name: 'estimated-value',
                value: {}
            }
        },
        unvalidated : true,
        valid       : false,
        options     : {
            submitHandler   : function (form){
                form.ajaxSubmit();
            },
            ignore          : '.disabled',
            messages        : {
                testQuestion: "Please answer the question"
            },
            rules           : {
                testQuestion: {
                    required: false
                }
            }
        },
        aggressive  : client.nada.aggressive,
        showBonus   : client.nada.showBonus,
        spins: {
            added: false,
            count: 0,
            display: 0
        },
        log: function (val) {
            console.log('Log Function', val);
        }
    };

    var dropdownQuestionPanel = {
        floorName: "questions",
        template: QuestionTpl,
        type: "dropdown",
        header: "Question &amp; Answer Time",
        subhead: "Answer every question for additional spins!",
        denote: "",
        fields: [
            {
                name: "question",
                type: "select",
                label: "",
                options: [],
                valid: false,
                unvalidated: true,
                value: ""
            }
        ],
        unvalidated: true,
        valid: false,
        options: {
            ignore: '.disabled',
            messages: {
                question: "Please answer the question"
            },
            rules: {
                question: {
                    valueNotEquals: "default"
                }
            }
        },
        spins: {
            added: false,
            count: 0,
            display: 0
        }
    };

    $.each(client.questions, function (i) {
    	var questionId, panel = {};
    	panel.qIndex = i + 1;

        if (typeof this.qId !== 'undefined') {
            questionId = this.qId;
        } else {
            questionId = null;
        }

        panel.qId = questionId;

    	if (this.type === "dropdown") {
            $.extend(true, panel, dropdownQuestionPanel);

            if (this.fields.options.length === 1) { // If this dropdown has select options set
                var x, q, arr = [];
                for (x in this.fields.options) { // Loop thru the options array
                    if (typeof this.fields.options[x].value === 'string') {
                        var values = this.fields.options[x].value.split(','); // Split the value string at the ','
                        var labels = this.fields.options[x].label.split(','); // Split the label string at the ','

                        for (q in values) { // Loop thru the arrays that came from the split(s)
                            // Setup a new object for each separate option that contains it's value and label
                            arr[q] = {
                                value: values[q].trim(),
                                label: labels[q].trim()
                            };
                        }

                        // Assign the newly created options objects to each respective option so they can be rendered
                        panel.fields[0].options[x] = {
                            value: arr
                        }
                    }
                }
            } else {
                panel.fields[0].label = this.label;
                panel.fields[0].options = this.fields.options;
            }

            panel.options ={
            	messages:{},
            	rules:{}
            };

            panel.options.messages['question'+ panel.qIndex] = dropdownQuestionPanel.options.messages.question;
            panel.options.rules['question'+ panel.qIndex] = dropdownQuestionPanel.options.rules.question;
        } else if (this.type === "nada") {
            nadaQuestionPanel.qIndex = panel.qIndex;
            panel = nadaQuestionPanel;
            panel.qId = questionId;
        } else if (this.type === "appointment") {
            appointmentQuestionPanel.qIndex = panel.qIndex;
            panel = appointmentQuestionPanel;
            panel.qId = questionId;
        }

        if (i === 0)
            panel.spins.display = 1;
        if (i === client.questions.length - 1) // actually add the spin with the last question.
            panel.spins.count = 1;

        panel.floorName = "question" + (i + 1);

        questionPanels.push(panel);
    });

    var sampleData = [
        // Get Started Panel
        {
            floorName   : 'getStarted',
            floorNumber : false,
            template    : IntroTpl,
            renderedTpl : false,
            type        : 'intro', // intro, input, modal, info, game, nada
            theme       : client.slotgame.theme || '',
            header      : client.getstartedheadine,
            subhead     : client.getstartedsubheadline,
            image       : client.getstartedimg,
            step1img    : (client.getstartedstep1img === null) ? (client.slotgame.theme && client.slotgame.theme !== '') ? 'img/'+ client.slotgame.theme +'/step_1.png' : 'img/step_1.png' : client.getstartedstep1img,
            step2img    : (client.getstartedstep2img === null) ? (client.slotgame.theme && client.slotgame.theme !== '') ? 'img/'+ client.slotgame.theme +'/step_2.png' : 'img/step_2.png' : client.getstartedstep2img,
            step3img    : (client.getstartedstep3img === null) ? (client.slotgame.theme && client.slotgame.theme !== '') ? 'img/'+ client.slotgame.theme +'/step_3.png' : 'img/step_3.png' : client.getstartedstep3img,
            denote      : "* progressive jackpot winnings between $5,000 & $10,000",
            nextPanel   : 'get started!',
            prevPanel   : false
        },
        // Registration Panel
        {
            floorName   : 'registration',
            template    : RegisterTpl,
            type        : 'register', // intro, input, modal, info, game, register
            header      : "Player Registration",
            subhead     : "Welcome! Sign up below to get started.",
            loginSubhead: "Welcome back! Sign-in below to get started.",
            denote      : "By registering, you are agreeing to our <a href='#' data-target='#regulationsModal' class='fireModal'>terms &amp; conditions</a>",
            fields : {
                socialRegister : {
                    fb      : true,
                    gplus   : true,
                    twitter : true,
                    fatwin  : true
                },
                manualRegister : [
                    {
                        type: 'group',
                        group: true,
                        fields: [
                           { label: 'First Name', name: 'firstname', type: 'text', valid: false, value: '', shown: true },
                           { label: 'Last Name', name: 'lastname', type: 'text', valid: false, value: '', shown: true }
                        ]
                    },
                    { label: 'Address', name: 'address', type: 'text', valid: false, value: '', shown: false },
                    { label: 'City', name: 'city', type: 'text', valid: false, value: '', shown: false },
                    { label: 'State', name: 'state', type: 'text', valid: false, value: '', shown: false },
                    { label: 'Zip/Postal Code', name: 'zip', type: 'text', valid: false, value: '', shown: false },
                    { label: 'Email Address', name: 'email', type: 'email', valid: false, value: '', shown: true },
                    { label: 'Phone #', name: 'phone', type: 'tel', valid: false, value: '', shown: true },
                ],
                login: [
                    { label: 'Email Address', name: 'login_email', type: 'email', valid: false, value: '', shown: true },
                ],
                notificationOptIn : (typeof client.notificationOptIn != 'undefined' && client.notificationOptIn)
            },
            spins       : {
                added: false,
                count: 1,
                display : 1
            },
            nextPanel   : 'sign up',
            prevPanel   : false,
            unvalidated : true,
            valid       : false,
            options     : { // Validation Options
                submitHandler   : function (form){
                },
                ignore          : '.disabled',
                messages        : {
                    firstname   : "Please tell us your first name",
                    lastname    : "Please tell us your last name",
                    email       : {
                        required: "Please give us your email address",
                        email   : "Please use the format: name@emailprovider.com",
                        remote  : function () {
                            $("#alreadyPlayedModal").modal();
                            return "Uh-Oh! Looks Like You've Played!";
                        }
                        
                    },
                    phone       : "Please tell us your phone number",
                    login_email : {
                        required: "Please give us your email address",
                        email   : "Please use the format: name@emailprovider.com",
                        remote  : "Invalid login."
                    }
                },
                onkeyup: false,
                onfocusout: false,
                rules           : {
                    firstname       : {
                        required: true
                    },
                    lastname        : {
                        required: true
                    },
                    email           : {
                        required: true,
                        email   : true,
                        remote  : {
                            url: "module/InstantWin/Customer/allowed",
                            async: false,
                            data: { jobs_no: window.currentJob },
                            dataFilter: function (data) {
                                data = JSON.parse(data);
                                // console.log('email input data', data);
                                if (data === true) {
                                    try {
                                        App.User.create();
                                    } catch (error) {
                                        console.error('Error:', error.message);
                                    }
                                }
                                return data;
                            }
                        }
                    },
                    phone           : {
                        required: false,
                        phoneUS : true
                    },
                    login_email : {
                        required: true,
                        email: true,
                        remote  : {
                            url: "module/InstantWin/Customer/login",
                            async: false,
                            data: { jobs_no: window.currentJob },
                            dataFilter: function (data) {
                                data = JSON.parse(data);

                                if (data.valid === true) {
                                    if (data.allowed === true) {

                                        App.User.set('key',data.customerKey);
                                        App.User.refresh();

                                        surl = "http://www."+App.Client.job+".fatwin.com/share?ref="+App.User.key;
                                        myGplus.init(surl);

                                        $("#panels").trigger('navNextValid', {
                                            pIndex: App.Rolodex.share
                                        });

                                        return true;
                                    }

                                    $("#alreadyPlayedModal").modal();

                                }
                                
                                return false;
                            }
                        }
                    }
                }
            }
        },
        // Question(s) Container Panel
        {
            floorName   : 'qContainer',
            type        : 'questions', // !important - tells system that this is a group of questions
            // All individual question panels go in questions array in same format as normal panels
            questions   : questionPanels,
            spins       : {
                added: false,
                count: 1,
                display: 1
            },
            nextPanel   : 'next',
            prevPanel   : 'back'
        },
        // Share Panel
        {
            floorName   : 'share',
            template    : ShareTpl,
            type        : 'share',
            header      : client.sharepanel.heading || "Share, Gain Double Spins, & We’ll Donate",
            subhead     : client.sharepanel.subhead || "Spread the word and gain two spins! <br/>Increase your chances of winning and we’ll donate $1.00 to help support breast cancer research.",
            denote      : false,
            share       : {
                user: user,
                post: {
                    heading : client.socialshares.text,
                    body: {
                        title   : client.socialshares.title || 'Play now for your chance to win!',
                        desc    : client.socialshares.desc || 'Spin2win is a PERQ game powered by FATWIN. Winners announced throughout the duration of the promotion. This is an official offer from ' + client.name + '. Please visit the link for terms &amp; conditions. No purchase necessary. Void where prohibited.',
                        img     : client.socialshares.image || Internal.formatRelativeUrl(defaultShareImage)
                    }
                },
                img: Internal.formatRelativeUrl('img/blank_profile_pic.jpg'),
                pinterest: {
                    url : {
                        href: function () {
                            var url = this.origin + "?media=" + encodeURIComponent(this.params.media) + "&description=" + encodeURIComponent(this.params.desc) + "&url=" + encodeURIComponent(this.params.url);
                            return url;
                        },
                        origin: 'http://www.pinterest.com/pin/create/button/',
                        params: {
                            url: document.location.origin + document.location.pathname,
                            media: document.location.origin + '/' + Internal.formatRelativeUrl((client.socialshares.image || defaultShareImage)),
                            desc: client.socialshares.text
                        }
                    }
                }
            },
            spins       : {
                added: false,
                count: 2,
                display: 2
            },
            nextPanel   : 'next',
            prevPanel   : 'back'
        },
        // Game Panel
        {
            floorName   : 'spin2win',
            template    : GameTpl,
            type        : 'game',
            header      : "Play the game!",
            subhead     : "You have earned all those spins - now use them!",
            gameUrl     : 'game/iframe.php',
            buttonText  : 'Click Here to Play Now',
            gameLaunched: false,
            denote      : false,
            options     : {},
            nextPanel   : 'next',
            prevPanel   : 'back'
        },
        /**
         * Thank You Panel:
         * THIS PANEL NEEDS:
         *  1. BOOLEAN winner SET BASED ON IF GAME WINNER
         *  2. PRIZE CLAIM CODE (tprizedistro_claim) IN CASE KIOSK HAS NO CONNECTION
         *  3. PRIZE IMAGES BASED ON KIOSK PRESENT AND PRIZE WON
         *  4. PRIZE NAME (IF NO KIOSK)
         *  5. URL FOR NO KIOSK PRIZE REDEMPTION (AMAZON)
         *  6. AMAZON REDEMPTION CODE (IF NO KIOSK)
         */
        {
            floorName   : 'thankYou',
            template    : ThanksTpl,
            type        : 'info',
            limage      : "image",
            winner      : false,
            claimCode   : '',
            kiosk       : client.hasKiosk,
            pinterest   : {
                url: window.location.origin + window.location.pathname,
                desc: client.offer.description,
                origin: window.location.origin
            },
            winnerFields: {
                header         : "You're A Winner!",
                kioskFields     : {
                    subhead     : "Congratulations on winning, but to redeem your prize you need to visit our in-store kiosk!  Your winning confirmation and a copy of your offer will be waiting in your inbox :).",  
                    prize_image : client.prizes.collageimage,
                    prize_head  : "You won one of these prizes!",
                    prize_text  : "Visit the Fatwin kiosk at the dealership to redeem your prize.  Your prize claim code: [tprizedistro_claim]"
                },
                noKioskFields   : {
                    subhead     : "Congratulations on winning!  Simply go <a href=\"http://www.fatwin.com\" target=\"_blank\">here to redeem</a> your prize code.  Confirmation and a copy of your offer below will be waiting for you in your inbox :).",  
                    prize_image : "[prize image without kiosk]",
                    prize_head  : "You won <prize name>!",
                    prize_text  : "<a href=\"http://wwwfatwin.com\" target=\"_blank\">Fatwin.com</a> redemption code: [redemption code]"
                }
            },
            loserFields : {
                header     : "Thanks for Visiting!",
                subhead    : "Even though you're not a winner, we want to thank you for participating!  Details on your offer will be waiting in your inbox, and don't forget to try again tomorrow! :)",
            }, 
            voucher     : {
                headline    : client.offer.headline,
                description : client.offer.description,
                legal       : client.offer.legal
             },
            nextPanel   : false,
            prevPanel   : 'back'
        },
        // Regulations Modal
        {
            floorName   : 'regulations',
            template    : RegulationsTpl,
            type        : 'modal',
            header      : 'Terms &amp; Conditions',
            subhead     : false,
            terms       : "t and c here bro",
            closeText   : 'close'
        },
        // Already Played Modal
        {
            floorName: 'alreadyPlayed',
            floorNumber: false,
            template: AlreadyPlayedTpl,
            type: 'modal',
            header: "Uh-Oh! Looks Like You've Played!",
            subhead: "We are so excited you want to play again, but we can't let you get an unfair advantage over the competition! You need to wait at least 24 hours before attempting to play again.",
            nextPanel: false,
            prevPanel: 'go back'
        },
        // Privacy Policy
        {
            floorName   : 'PrivacyPolicy',
            template    : PrivacyPolicyTpl,
            type        : 'modal',
            header      : 'PERQ Privacy Policy',
            subhead     : false,
            terms       :"PERQ Privacy Policy <br/>Effective Date: December 2, 2013<br/><br/>PERQ, LLC and its affiliated persons and entities including, but not limited to FATWIN, LLC (collectively, “Company”), is committed to protecting the privacy of our website visitors and customers. We strive to uphold the highest industry standards for online privacy. For more information about how Company enforces content/permission email marketing with our customers, please see our <a href=\"http://fatwin.com/anti-spam\" target=\"_blank\">anti—spam policy</a>.<br/><br/>We also create services and technology made available to our customers that allow them to promote their brands and products to consumers (“Applications”). If we collect information (including personal information) through our Applications, we may store and process that information. To learn about how a PERQ customer uses the information it collects through our application; please see their privacy policy.<br/><br/>The information Company collects about you on this website and any cobranded websites (collectively, “Website”), is used to provide you with a more personalized and rich experience while visiting the Website. Your use of the Website is expressly conditioned on your acceptance of and agreement to this Privacy Policy.<br/><br/>What does Privacy Policy Cover: This privacy policy covers how Company treats information that it collects and receives about you via the Website, including information related to your past use of the Website. By using the Website and thereby agreeing to this Privacy Policy, you expressly consent to Company’s use and disclosure of automatic and personal information provided to Company when you interact with the Website, as described in this Privacy Policy. This privacy policy does not apply to: (i) the practices of companies or other third parties that Company does not own or control, or people that Company does not employ or manage; or (ii) any offline matters, activities or information that Company or any affiliate collects about you or anybody else.<br/><br/>How does Company collect and use information: The information learned from the Website’s users, members and customers helps Company personalize and continually improve your experience at the Website. Below are the types of Information Company gathers and how this information is used:<br/><br/>Login Information: We may automatically obtain and store HTTP header information from client-side tracking objects, your device, and our server logs upon your use of our services.  Mobile Information: We may obtain information specific to mobile activity through use of our services, such as your location, mobile device type, and mobile capabilities.  Social Media Information: When interacting with our services within social media, we may obtain information stored within social media or authorized by you to be collected by us within such social media. This information may include your contact information, email address, friend information, friends and pages with which you have an association, and other information stored within social media.  IP Address: Your Internet Protocol (“IP”) address is a unique identifier used to connect your computer to the Internet. Your IP address also is stored in Company’s user registration databases when you register with Company. IP addresses may be used for various purposes, including to: 1) help Company gather broad demographic information; 2) diagnose service or technology problems reported by Company users or engineers that are associated with the IP addresses controlled by a specific Web company or ISP; and 3) estimate the total number of users visiting Company from specific countries or regions of the world.  Cookies: Company uses a feature of your Internet Web browser called a “cookie,” a small piece of information stored on your hard drive that uniquely identifies your intra-and inter-requests on the Website. Cookies may be used for various purposes, including keeping track of preferences you specify while you are using Company’s services and the Website. If you wish to disable the use of cookies, please review the Help section of your Internet browser for instructions.  Web Beacons: Web pages may contain electronic images (called a “single-pixel GIF” or “Web beacon”) that allow a website to count users who have visited that page or to access certain cookies. Personal Information: Company may receive and store information that personally identifies you. The types of personally identifiable information that may be collected at the Website include: name, address, email address, phone number, fax number, billing address, shipping address, product selections, order number, referring URL, IP address, password, username, how you got to know about the Website, gender, occupation, personal interests, your age and information about your interests in and use of various products, programs and services. You voluntarily provide this personally identifiable information when you enter it on the Website.Disclosure of information: Company may disclose information about you to those whose practices are not covered by this Privacy Policy in the following limited circumstances:<br/><br/>Company responds to subpoenas, court orders, or legal process, or to establish or exercise Company’s legal rights or defend against legal claims.Company shares information in order to investigate, prevent or take action regarding illegal activities, suspected fraud, situations involving potential threats to the physical safety of any person, violations of Company’s terms of use or as otherwise allowed by law.Information collected via specific sponsored promotions will be shared with the sponsor of the promotion for marketing purposes.Otherwise, Company does not share with, rent, transfer or sell to any nonaffiliated entities the personal information gathered through this Website. However, due to the existing regulatory environment, Company cannot ensure that all of your private communications and other personal information will never be disclosed in ways not otherwise described in this Privacy Policy. By way of example (without limiting the foregoing), third parties may unlawfully intercept or access transmissions or private communications.<br/><br/>Links to Third Parties: Company may establish relationships with business partners by creating a link between their sites and the Website. Company is not, however, responsible for the content, maintenance or privacy policies of those sites. Once you click over to a third party site, Company encourages you to check its privacy policy. The Website may contain links to other sites whose information practices may be different than the information practices of Company users who click over to a third party site from a link on the Website must be aware that Company makes no warranties with regard to that site’s policies or business practices. Company is not responsible for any transactions that occur between the user and the third party site. Please consult the other site’s privacy policies, as Company has no control over information that is submitted to or collected by these third parties. Should a user purchase any products or services from that third party site, the user must contact the third party site directly regarding any disputes that might occur, including but not limited to delayed shipping, missing products, damaged goods or pricing and billing discrepancies. Company is not responsible for the actions of any third-party site.<br/><br/>Google: Company may utilize Google for Display Advertising, which enables Google Analytics to collect data about our traffic via the DoubleClick in addition to data collected through the standard Google Analytics implementation. Display Advertising lets us enable features in Analytics that aren’t available through standard implementations, like Remarketing with Google Analytics, Google Display Network Impression Reporting, the DoubleClick Campaign Manager integration, and Google Analytics Demographics and Interest Reporting. We will not facilitate the merging of personally-identifiable information with non-personally identifiable information previously collected from Display Advertising features that is based on the DoubleClick cookie unless you have provided us with affirmative consent to that merger. We have implemented the following Google Analytics features based on Display Advertising: ________________________________________. You may opt out of Google Analytics for Display Advertising and customize Google Display Network at https://www.google.com/settings/u/0/ads.<br/><br/>Additionally, you can opt out by going to https://tools.google.com/dlpage/gaoptout/ and adding Google Analytics Opt-out Browser.<br/><br/>We have or may in the future implement Remarketing with Google Analytics. Through this we use Remarketing with Google Analytics to advertise online. Third-party vendors, including Google, may show your ads on sites across the Internet. Company and third-party vendors, including Google, use first-party cookies (such as the Google Analytics cookie) and third-party cookies (such as the Double Click cookie) together to inform, optimize, and serve ads based on someone’s past visits to our website.<br/><br/>We have or may in the future implement Google Display Network Impression Reporting or the DoubleClick Campaign Manager integration. Company and third-party vendors, including Google, use first-party cookies (such as the Google Analytics cookies) and third-party cookies (such as the DoubleClick cookie) together to report how your ad impressions, other uses of ad services, and interactions with these ad impressions and ad services are related to visits to our site.<br/><br/>We have or may in the future implement Google Analytics Demographics and Interest Reporting. We use data from Google’s Interest-based advertising or 3rd-party audience data (such as age, gender, and interests) in conjunction with our business goals and strategies. NEED MORE DETAIL HERE.<br/><br/>There are other ways in which we may utilize Google. For more information regarding our use of Google, please go to https://support.google.com/analytics/answer/2700409. Additionally, you can email us at <a href=\"mailto:info@perq.com\">info@perq.com</a> with any questions.<br/><br/>Testimonials: We post customer testimonials on our web site, which may contain personally identifiable information. We do obtain the customer’s consent prior to posting the testimonial to post their name along with their testimonial. If you wish to request that your testimonial be removed you may do so by emailing us at <a href=\"mailto:info@perq.com\">info@perq.com</a>.<br/><br/>Public Forums: Our Web site may offer publicly accessible blogs and/or community forums. You should be aware that any information you provide in these areas may be read, collected, and used by others who access them. To request removal of your personal information from our blog or community forum, contact us at <a href=\"mailto:info@perq.com\">info@perq.com</a>. In some cases, we may not be able to remove your personal information, in which case we will let you know if we are unable to do so and why.<br/><br/>Business Transfers: As Company continues to develop its business; it might sell or buy other companies. In such transactions, customer information generally is one of the transferred business assets. Also, in the event that Company or substantially all of its assets are acquired, customer information will be one of the transferred assets.<br/><br/>Social Media Features: Our Web site includes Social Media Features. These features may collect your IP address, which page you are visiting on our site, and may set a cookie to enable the feature to function properly. Social Media Features either hosted by a third party or hosted directly on our Site. Your interactions with these Features are governed by the privacy policy of the company providing it.<br/><br/>Children’s Information: Company does not knowingly collect personally identifiable information from children under the age of 13, nor does it contact children under the age of 13. If Company is notified of this, once Company has verified the information, Company will promptly obtain parental consent or otherwise delete the information from its servers. If you want to notify Company of its receipt of information in relation to children under the age of 13, please email the Company at the Company’s information located on their website.<br/><br/>Changes to Privacy Policy: Company will occasionally update this Privacy Policy at Company’s sole discretion. Please check the Website frequently to see recent changes. Such changes and/or modifications shall become effective immediately upon posting thereof. Without limiting the foregoing, Company may occasionally notify you by email about changes to the Website or provide notices of changes by displaying notices or links to notices to you generally on the Website. Your continued use of the Website constitutes your agreements to this Privacy Policy and all of the terms and conditions set forth herein. If you have any questions or concerns about our Privacy Policy, please email us at the contact information on the site.<br/><br/>Questions About This Policy: If you have any questions about this Policy, please contact us at <a href=\"mailto:info@perq.com\">info@perq.com</a>.",
            closeText   : 'close'
        },
        // Offical Rules
        {
            floorName   : 'Rules',
            template    : RulesTpl,
            type        : 'modal',
            header      : 'Offical Rules',
            subhead     : false,
            terms       : client.officialrules,
            closeText   : 'close'
        },
        // NADA Details
        {
            floorName   : 'NadaDetails',
            template    : NadaDetailsTpl,
            type        : 'modal',
            header      : 'Offer for Appraisal',
            subhead     : 'Vehicle Pricing &amp; Information',
            terms       : client.terms,
            closeText   : 'close',
            icon        : 'nada',
            offer       : {
                user: {},
                dealer: client,
                expires: moment(client.offer.expires, 'YYYYMMDD').calendar() || moment().add('weeks', 6).calendar()
            },
            showBonus   : client.nada.showBonus,
            toCurrency  : function () {
                return function (str) {
                    var idx;
                    str = str.trim();
                    
                    if (typeof App.Rolodex.NadaDetails === 'undefined') {
                        idx = $('#NadaDetailsModal').data('index');
                    } else {
                        idx = App.Rolodex.NadaDetails;
                    }

                    if (typeof idx === 'undefined') {
                        return false;
                    } else {
                        var val = App.Promotion.view.get('panels['+ idx +'].'+ str);
                        return Number(val).toCurrency();
                    }
                };
            }
        }
    ];

    $.extend(true, App, {
        Rolodex: {
            panels: {},
            floors: {},
            init: function (panels) {
                var
                i,
                c,
                val,
                data = {},
                rolodex = {};

                for (c in panels) {
                    val = panels[c].floorName;
                    data[val] = c;
                }

                // console.log('Rolodex.panels', data);
                App.Rolodex = data;
                App.Rolodex.init = this.init;
                // console.log('App.Rolodex', App.Rolodex);

                rolodex = App.Rolodex;
                App.Promotion.view.set('rolodex', rolodex);

                return App;
            }
        },
        Client: client,
        User: user,
        Prizes: client.prizes,
        Promotion: {
            init: function (callback){
                App.Promotion.view = new Panels({
                    el: 'panels-container',
                    template: MainTpl
                });

                if (typeof callback === 'function') {
                    callback.call(this, arguments);
                };

                return App;
            },
            setShareUser: function (user) {
                var
                idx = App.Rolodex.share,
                data = App.Promotion.view.get('panels['+ idx +']'),
                tpl = data.template;

                App.Promotion.view.set('panels['+ idx +'].share.user', user);
                App.Promotion.view.set('panels['+ idx +'].share.url', window.location.origin + window.location.pathname);
                App.Promotion.view.set('panels['+ idx +'].share.origin', window.location.origin);
                // rendered = Internal.compile(tpl, data);
                // App.Promotion.view.set('panels['+ idx +'].renderedTpl', rendered);
                $('#social_name').html(user.name);
                // $('.NxtBtn', 'section[name=share]').on('click', function (e){});
            },
            functions: {
                nada: {
                    pIndex  : 0,
                    qIndex  : 0,
                    year    : false,
                    make    : false,
                    model   : false,
                    value   : {},
                    init: function (){
                        var self = this;
                        // console.log('Init is running!');
                        // console.log('qIndex', this.qIndex);
                        
                        $('#year').on('change', function (e){
                            self.updateYear(this.value);
                            $('body').trigger('YearSelected', [this.value]);
                        });

                        $('#make').on('change', function (e){
                            self.updateMake(this.value);
                            $('body').trigger('MakeSelected', [self.year, this.value]);
                        });

                        $('#model').on('change', function (e){
                            self.updateModel(this.value);
                            $('body').trigger('ModelSelected', [self.year, self.make, this.value]);
                        });

                        $('#estimated-value, #trade-bonus, #trade-total, #based-on').on({
                            change: function (e){
                                // console.log('CHANGED HIDDEN NADA INPUT VALUE');
                                var
                                update = Number($(this).val()).toCurrency(),
                                display = '#' + $(this).attr('id') + '-display';

                                switch ($(this).attr('id')) {
                                    case 'trade-total':
                                        var $nadaTotal = $('#nada-total', display);
                                        $nadaTotal.html(update);
                                        break;

                                    case 'based-on':
                                        update = $(this).val();
                                        $(display).html(update);
                                        break;

                                    case 'estimated-value':
                                        update = Number($(this).val()).toCurrency();
                                        $(display).html(update);
                                        break;

                                    default:
                                        update = Number($(this).val()).toCurrency();
                                        $('span', display).html(update);
                                        break;
                                }
                            }
                        });
                    },
                    renderOptions: function (property, options){
                        var l, label, self = this, element = '#' + property;
                        
                        try {
                            // Capitalize first letter of each default select option
                            property = Internal.capitalizeFirstLetter(property);
                        } catch (error) {
                            console.error('Error:', error.message);
                        }

                        label = property;
                        
                        $(element).html('<option value="">' + label + '</option>');
                        $.each(options, function (k){
                            var opt = $('<option/>');
                            opt.val(this.value).html(this.label);
                            $(element).append(opt);
                        });
                    },
                    getOptions: function (property, data){
                        var
                        estimate = {},
                        self = this,
                        options = [],
                        $year = data.year,
                        $make = data.make,
                        $model = data.model;
                        
                        if (typeof property !== 'undefined'){
                            switch (property){
                                case 'year':
                                    var
                                    i,
                                    start = new Date().getFullYear(),
                                    end = 1970;

                                    for (i = start; i >= end; i--){
                                        var option = {};
                                        option.value = i;
                                        option.label = i;
                                        options.push(option);
                                    }
                                    
                                    // view.set(activeUri + '.options', options);
                                    self.renderOptions(property, options);
                                    return options;

                                case 'make':
                                    if (!self.year || self.year === 0 || typeof(self.year) === 'undefined'){
                                        self.year = $('#year option:selected').val();
                                    }

                                    $year = self.year;
                                    var url = 'module/VehicleData/Distinct/' + encodeURIComponent($year);

                                    $.ajax({
                                        url: url,
                                        success: function (data){
                                            var json = $.parseJSON(data);

                                            for (var i = 0; i < json.length; i++){
                                                var option = {
                                                    value: json[i],
                                                    label: json[i]
                                                };

                                                options.push(option);
                                            }

                                            return options;
                                        }
                                    }).done(function (){
                                        $('body').trigger('renderOptions', ['make', options]);
                                    });

                                    return options;

                                case 'model':
                                    if (!self.year || self.year === 0 || typeof(self.year) === 'undefined'){
                                        self.year = $('#year option:selected').val();
                                    }

                                    if (!self.make || self.make === 0 || typeof(self.make) === 'undefined'){
                                        self.make = $('#make option:selected').val();
                                    }

                                    $year = self.year;
                                    $make = self.make;

                                    var url = 'module/VehicleData/Distinct/' + encodeURIComponent($year) +'/'+ encodeURIComponent($make);

                                    $.ajax({
                                        url: url,
                                        success: function (data){
                                            var json = $.parseJSON(data);
                                            // console.log('Data - After', json);

                                            for (var i = 0; i < json.length; i++){
                                                var option = {
                                                    value: json[i],
                                                    label: json[i]
                                                };
                                                options.push(option);
                                            }

                                            return options;
                                        }
                                    }).done(function (){
                                        $('body').trigger('renderOptions', ['model', options]);
                                        // view.set(activeUri + '.options', options);
                                        // console.log('GetOptions', {
                                        //     uri: activeUri,
                                        //     uriPlus: activeUri + '.options',
                                        //     get: view.get(activeUri + '.options')
                                        // });

                                        // self.set(activeUri + '.options', options);
                                        // self.renderOptions(property, options);
                                    });

                                    return options;
                            }
                        }
                    },
                    getEstimate: function (year, make, model){
                        var
                        estimate = {
                            value: 0,
                            bonus: 0,
                            total: 0,
                            basedOn: false
                        },
                        $year = $('#year option:selected').val(),
                        $make = $('#make option:selected').val(),
                        $model = $('#model option:selected').val();

                        var url = 'module/VehicleData/Distinct/'+ encodeURIComponent($year) +'/'+ encodeURIComponent($make) +'/'+ encodeURIComponent($model);
                        
                        $.ajax({
                            url: url,
                            success: function (data){
                                var json = $.parseJSON(data);
                                // console.log('Data', json);
                                
                                estimate.value = Number(json.value);
                                estimate.bonus = estimate.value * 0.2;
                                estimate.total = estimate.value + estimate.bonus;
                                estimate.basedOn = json.basedOn;

                                $('#estimated-value').val(estimate.value).change();
                                $('#trade-bonus').val(estimate.bonus).change();
                                $('#based-on').val(estimate.basedOn).change();
                                $('#trade-total').val(estimate.total).change();

                                return estimate;
                                // self.set('value.value', estimate.value);
                                // self.set('value.bonus', estimate.bonus);
                                // self.set('value.basedOn', estimate.basedOn);
                            }
                        }).done(function (){
                            $('body').trigger('showEstimate');
                        });

                        return estimate;
                    },
                    updateYear: function (year){
                        this.year = year;
                        this.make = false;
                        this.model = false;
                        this.value = false;
                        return this;
                    },
                    setMakes: function (year){
                        // var object = App.Promotion.view.get('panels['+ this.pIndex +'].questions['+ this.qIndex +'].fields.make');
                        var object = App.Promotion.functions.nada.getOptions('make');
                        // console.log('GetMakes - Object', object);
                        var options = object.getOptions(year);

                        try {
                            App.Promotion.view.set('panels['+ this.pIndex +'].questions['+ this.qIndex +'].fields.make.options', options);
                        } catch (error) {
                            console.error('Error:', error.message);
                        }
                    },
                    updateMake: function (make){
                        this.make = make;
                        this.model = false;
                        return this;
                    },
                    setModels: function (year, make){
                        var object = App.Promotion.functions.nada.getOptions('model');
                        // console.log('GetModels - Object', object);
                        var options = object.getOptions(year, make);

                        try {
                            App.Promotion.view.set('panels['+ this.pIndex +'].questions['+ this.qIndex +'].fields.model.options', options);
                        } catch (error) {
                            console.error('Error:', error.message);
                        }
                    },
                    getModels: function (){
                        var options = [];
                        var self = this;

                        if (!year){
                            year = $('#year option:selected').val();
                        }

                        if (!make){
                            make = $('#make option:selected').val();
                        }

                        $.ajax({
                            url: 'module/VehicleData/Distinct/' + year + '/' + make,
                            success: function (data){
                                var json = $.parseJSON(data);

                                for (var i = 0; i < json.length; i++){
                                    var option = {
                                        value: json[i],
                                        label: json[i]
                                    }
                                    options.push(option);
                                }

                                self.renderOptions(options);
                                return options;
                            }
                        });

                        // console.log('Model Options', options);

                        return options;
                    },
                    updateModel: function (model){
                        this.model = model;
                        return this;
                    },
                    setValue: function (value){
                        console.log('SetValue Running!', value);
                        try {
                            self.value = value;
                            App.Promotion.view.set('panels['+ this.pIndex +'].questions['+ this.qIndex +'].fields.value.value', value);
                        } catch (error) {
                            console.error('Error:', error.message);
                        }
                    },
                    getValue: function (){
                        var options = [];
                        var self = this;

                        if (!self.year || self.year === 0 || typeof(self.year) === 'undefined'){
                            year = $('#year option:selected').val();
                        }

                        if (!self.make || self.make === 0 || typeof(self.make) === 'undefined'){
                            make = $('#make option:selected').val();
                        }

                        $.ajax({
                            url: 'module/VehicleData/Distinct/'+ self.year +'/'+ self.make +'/'+ self.model,
                            success: function (data){
                                var json = $.parseJSON(data);
                                // console.log("Data", json);
                                self.value = json;
                            }
                        });

                        return options;
                    },
                    updateValue: function (value){
                        self.setValue(value);
                        var data = App.Promotion.view.get('panels['+ this.pIndex +'].questions['+ this.qIndex +'].fields.value');
                        $(data.name).val(data.value);
                    }
                }
            }
        },
        SpinCounter: {
            init: function (callback){
                App.SpinCounter.view = new SpinCounter({
                    el: 'spin-counter',
                    template: SpinCounterTpl,
                    render: function (){
                        return Internal.compile(this.template, this.get());
                    }
                });

                if ($.isFunction(callback)){
                    callback.call(this, arguments);
                }

                return App;
            }
        },
        MissionControl: {
            init: function (callback){
                App.MissionControl.view = new Ractive({
                    el: 'mission-control',
                    template: MissionCtrlTpl,
                    data: {
                        log: function () {},
                        formatCurrency: function (value){
                            value = parseFloat(value);
                            value = (value).toCurrency(2);
                            return value;
                            // value = variable.value.parseFloat();

                            // value.toFixed(2);
                            // value.formatMoney(2)
                        }
                    }
                });

                if ($.isFunction(callback)){
                    callback.call(this, arguments);
                }

                return App;
            }
        },
        WinnersFeed: {
            init: function (options, callback){
                var self = this;
                if ($.isFunction(options)){
                    callback = options;
                }

                self.view = new Ractive({
                    el: 'feed',
                    template: FeedTpl
                });

                try {
                    self.view.set({
                        job: options.job,
                        winners: {}
                    });
                } catch (error) {
                    console.error('Error:', error.message);
                }

                self.plugin = Feed;
                Feed.init(options);

                $(function (){
                    $(window).on('resize', function (e){
                        self.plugin.resize();
                    });
                });

                if ($.isFunction(callback)){
                    callback.call(this, arguments);
                }

                return App;
            }
        },
        Compatibility: Compatibility,
        fireModal: function (e, target, url){
            if (url !== '') {
                $(target).modal({
                    remote: url
                });
            } else {
                $(target).modal();
            }
        },
        init: function (){
            var self = this, panels = [], ascensor, partials = {}, modals = {}, floorNames = [], questions = {}, i = 0;

            /**
             * Set up rendered templates for each panel
             */
            $.each(sampleData, function (key, value){
                if (value.type === 'intro' || value.type === 'modal') {
                    /**
                     * Add the floorName to the panels array.
                     * This allows us to add it to the panel progression,
                     * but not include it in the map of floorNames.
                     */
                    panels.push(value);

                    value.isPanel = false;
                    value.isModal = true;
                    value.isQContainer = false;
                    i = key + 50; // Change up the key to differentiate between panel types
                    
                    modals[i] = Internal.compile(value.template, value);
                    value.renderedTpl = modals[i];

                } else if (value.type === 'questions') {
                    // Questions Panels
                    value.isPanel = false;
                    value.isModal = false;
                    value.isQContainer = true;
                    i = key;
                    value.pIndex = i;
                    // console.log('Type == Questions', value);
                    
                    /**
                     * Add to the floorNames array to create map of all floors (panels)
                     */
                    floorNames.push(value.floorName);

                    /**
                     * Loop through each question to differentiate between the different
                     * questions types and all of the intricacies that come with them.
                     */
                    var c;
                    for (c = 0; c < value.questions.length; c++){
                        var
                        $self = value.questions[c],
                        floor = $self.floorName,
                        tpl = $self.template,
                        qCount = value.questions.length;

                        $self.qCount = qCount;
                        $self.pIndex = i;
                        $self.indexes = {
                            q: c,
                            p: i
                        }

                        panels.push($self);
                        
                        if (c + 1 === value.questions.length){
                            $self.lastQuestion = true;
                        } else {
                            $self.lastQuestion = false;
                        }

                        // console.log('$self.lastQuestion', $self.lastQuestion);

                        if ($self.type === 'nada'){
                            /** 
                             * Initially sets options for #year
                             */
                            var yearOptions = [];
                            yearOptions = $self.fields.year.getOptions();
                            $self.fields.year.options = yearOptions;

                            /**
                             * Add question to questions array
                             * (NOTICE: Question not added to panels or floorNames array(s))
                             */
                            questions[floor] = Internal.compile(tpl, $self);
                            $self.renderedTpl = questions[floor];
                        } else {
                            questions[floor] = Internal.compile(tpl, $self);
                            $self.renderedTpl = questions[floor];
                        }
                    }

                } else {

                    // console.log('Type == panel', value);
                    value.isPanel = true;
                    value.isModal = false;
                    value.isQContainer = false;
                    i = key;
                    value.pIndex = i;
                    value.indexes = {
                        p: i
                    };

                    floorNames.push(value.floorName);
                    panels.push(value);
                    
                    partials[value.floorName] = Internal.compile(value.template, value);
                    value.renderedTpl = partials[value.floorName];

                }

                value.floorNumber = i;
            });

            /**
             * Initialize Promotion
             */
            try {
                this.Promotion.init(function (){
                    try {
                        App.Promotion.view.set('panels', panels);
                    } catch (error) {
                        console.error('Error:', error.message);
                    }

                    return App;
                });
            } catch (error) {
                console.error('Error:', error.message);
            }

            /**
             * Initialize SpinCounter
             */
            try {
                this.SpinCounter.init(function (){
                    App.SpinCounter.view.set('spins', 0);
                    App.SpinCounter.view.set('user', App.User);
                    
                    return App;
                });
            } catch (error) {
                console.error('Error:', error.message);
            }

            try {
                $(App.User).on({
                    userCreated: function (e, user) {
                        console.log('UserCreate Listener Firing', {
                            user: user,
                            User: App.User
                        });
                        
                        App.User.refresh(user.key);
                        App.SpinCounter.view.set('user', App.User);

                        //google plus create share button
                        surl = "http://www."+ App.Client.job +".fatwin.com/share?ref="+ App.User.key;
                        myGplus.init(surl);
                        myTwitter.makeShare(surl, App.Client.socialshares.text);
                    },
                    userRefresh: function (e, user){
                        console.log('userRefresh Listener Firing!', {
                            user: user,
                            User: App.User
                        });
                        
                        App.SpinCounter.view.set('user', App.User);
                        App.Promotion.setShareUser(App.User);

                        //google plus create share button
                        surl = "http://www."+ App.Client.job +".fatwin.com/share?ref="+ App.User.key;
                        myGplus.init(surl);
                        myTwitter.makeShare(surl, App.Client.socialshares.text);
                    }
                });
            } catch (error) {
                console.error('Error:', error.message);
            }

            /**
             * Initialize MissionControl
             */
            try {
                this.MissionControl.init(function (){
                    try {
                        App.MissionControl.view.set({
                            client: client,
                            contact: client.contactName,
                            logo: client.logo,
                            jackpots: {
                                progressive: {
                                    title: 'Progressive Jackpot',
                                    message: '<h5>CHA-CHING!</h5>You added <strong>5 cents</strong> to the jackpot just by registering! For every new registration the jackpot will continue to grow!',
                                    value: 3000.00
                                },
                                toDate: {
                                    title: 'Winnings to Date',
                                    value: 3682591.03
                                }
                            },
                            prizes: App.Prizes, 
                            fb: {
                                enabled: client.socialaccounts.fb.enabled,
                                url: client.socialaccounts.fb.url
                            },
                            gplus: {
                                enabled: client.socialaccounts.gplus.enabled,
                                url: client.socialaccounts.gplus.url
                            },
                            twitter: {
                                enabled: client.socialaccounts.twitter.enabled,
                                url: client.socialaccounts.twitter.url
                            },
                            website: client.website,
                            address : {
                                address: client.address.address,
                                city: client.address.city,
                                state: client.address.state,
                                zip: client.address.zip
                            },
                            phone: client.phone

                        });

                        $.ajax('ProgressiveJackpot/current').done(function (data) {
                            App.MissionControl.view.set('jackpots.progressive.value', data);
                        });

                    } catch (error) {
                        console.error('Error:', error.message);
                    }

                    try {
                        App.MissionControl.view.partials = {
                            regulations: Internal.compile(RegulationsTpl, App.MissionControl.view.get('client'))
                        };
                    } catch (error) {
                        console.error('Error:', error.message);
                    }

                    return App;
                });
            } catch (error) {
                console.error('Error:', error.message);
            }

            /**
             * Initialize WinnersFeed
             */
            try {
                this.WinnersFeed.init({ job: window.currentJob }, function (){
                    App.WinnersFeed.plugin = WinnersFeed;
                    return App;
                });
            } catch (error) {
                console.error('Error:', error.message);
            }

            /**
             * Set Panels
             */
            try {
                this.Promotion.view.set('panels', sampleData);
            } catch (error) {
                console.error('Error:', error.message);
            }
            
            /**
             * This runs as soon as the DOM has finished loading
             * so that we know all elements and templates are 
             * compiled, inserted, and ready to go.
             */
            $(function (){
                /**
                 * Initialize Other Modules (ex: App.Promotion.modules.nada)
                 */
                try {
                    App.Promotion.functions.nada.init(App.Promotion.view);
                    // App.Promotion.modules.nada = new Nada(App.Promotion.view);
                } catch (error) {
                    console.error('Error:', error.message);
                }

                /**
                 * Add any extra validation functions that are necessary
                 */
                $.validator.addMethod('valueNotEquals', function (value, el, arg){
                    return arg != value;
                }, "Value must not equal arg.");

                /**
                 * Customize the date validation method to handle iOS 5 date inputs
                 */
                if ($.validator) {
                    var originalDateValidator1 = $.validator.methods.date;
                    var originalDateValidator2 = $.validator.methods.dateISO;

                    $.validator.methods.date = function (value, element) {
                        var isValidDate =
                            originalDateValidator1.apply(this, arguments) ||
                            originalDateValidator2.apply(this, arguments);

                        return isValidDate;
                    };
                }

                /**
                 * Datepicker Init
                 */
                if (!Internal.isInputTypeSupported('date')) { // Browser does NOT have native date input support
                    var date = moment();
                    $('#apptDate').DatePicker({
                        format: 'm/d/Y',
                        date: date,
                        onChange: function (formattedDate, dateObj, el){
                            // console.log('DatePicker Changed', {
                            //     date: formattedDate,
                            //     dateObj: dateObj,
                            //     el: el
                            // });
                            $(el).val(formattedDate);
                            $(document).trigger('dateSelected', [formattedDate, dateObj, el]);
                        }
                    });
                } else { // Browser DOES have native date input support
                    var eventType;
                    if (/chrome/i.test(navigator.userAgent) === true) {
                        eventType = 'change';
                    } else {
                        eventType = 'blur';
                    }

                    $('#apptDate').on(eventType, function (e){
                        var
                        newDate = $(this).val(),
                        dateObj = moment(newDate),
                        formattedDate = dateObj.format('YYYY-MM-DD');
                        // formattedDate = dateObj.format('MM[/]DD[/]YYYY');

                        $(this).val(formattedDate);
                        $(document).trigger('dateSelected', [formattedDate, dateObj, this]);
                    });
                }
                
                /**
                 * Initialize BG Img Plugin
                 */
                $.vegas({
                    src: App.Client.background,
                    valign: 'center',
                    align: 'center',
                    fade: 4000
                });
                
                /**
                 * Skip All Questions Button
                 */
                $(document).on('click', ".skip-questions", function (e){
                    $('#panels').trigger('navNextSkip');
                    e.preventDefault();
                    return false;
                });

                $('input[name=phone]', '#manual-registration').on({
                    keydown: function (e) {
                        var code = e.which || e.keyCode;
                        if (code === 9 && event.shiftKey) {
                            console.log('You pressed SHIFT + TAB');
                        } else if (code === 9) {
                            console.log('Tab key pressed on phone input', code);
                            e.preventDefault();
                        } else if (code === 13) {
                            console.log('Enter key pressed', code);
                            // Enter Key
                            $('.panelsLinkNext', '#registration-content').click();
                        }
                    }
                });

                $.each(panels, function (idx, val) {
                    $('input:not([type=checkbox]):not([type=hidden]):last, select:last, textarea:last', '#'+ val.floorName +'-content').on({
                        focus: function (e) {
                            console.log('focused the input', val.floorName);
                        },
                        keyup: function (e) {
                            var code = e.which || e.keyCode;

                            switch (code) {
                                case 9:
                                    // Tab Key
                                    console.log('Tab key pressed', code);

                                    e.preventDefault();
                                    break;

                                case 13:
                                    console.log('Enter key pressed', code);
                                    // Enter Key
                                    $('.panelsLinkNext', '#' + val.floorName + '-content').click();
                                    break;

                            }
                        }
                    });
                });

                /**
                 * We use '#panels' because that is the Ascensor object.
                 * This way, we only have to listen to one object for progression-based events.
                 */
                $('#panels').on({
                    // Runs before initializing Panels
                    beforeAscInit   : function (e){
                        var list = App.Promotion.view.get('panels[0]');
                        if (!window.location.hash) {
                            if (list.type === 'intro' || list.type === 'modal'){
                                $('#' + list.floorName + 'Modal').modal();
                            }
                        }
                    },
                    // Runs on "Prev" btn click
                    navPrev         : function (e, params){
                        var
                        panel = params.panel,
                        pIndex = params.pIndex,
                        qIndex = params.qIndex,
                        type = params.type;
                        var form = panel + '-form';
                        if(typeof qIndex != 'undefined' && qIndex > 0){ // not the first question!
                            var qOptions = {
                                    panel: App.Promotion.view.get('panels[' + pIndex + ']'),
                                    index: pIndex,
                                    count: App.Promotion.view.get('panels[' + pIndex + '].questions.length'),
                                    hide: App.Promotion.view.get('panels[' + pIndex + '].questions[' + (qIndex) + ']'),
                                    show: App.Promotion.view.get('panels[' + pIndex + '].questions[' + (qIndex-1) + ']')
                                };
                            $(form).trigger('navPrevQuestion', qOptions);
                        }
                        else {
                            var submitOptions;
                            if (type === 'panel' || type === 'question'){
                                submitOptions = {
                                    job: App.User.job,
                                    key: App.User.key,
                                    panel: panel,
                                    pIndex: pIndex,
                                    qIndex: qIndex,
                                    form: form,
                                    type: type
                                };
                             }
                             else if (type === 'qcontainer'){
                                var valid = params.valid;
                                submitOptions = {
                                    panel: panel,
                                    pIndex: pIndex,
                                    qIndex: qIndex,
                                    job: App.User.job,
                                    key: App.User.key,
                                    form: form
                                };
                            }
                            if($(form).valid())
                                $(form).trigger('navPrevValid', submitOptions);
                            else
                                $(form).trigger('navPrevSkip', submitOptions);
                        }
                    },
                    navNextValid	: function (e,params){
                    	Internal.calcSpinsEarnedForThisPanel(App,params.pIndex);
                        var pIndex = Number(params.pIndex);
                        
                        // Redirect to website on thank you panel
                        if (pIndex === (Number(App.Rolodex.thankYou) - 1) && App.Client.website) {
                            $(document).trigger('startCountdown.redirector');
                        } else if (pIndex === (Number(App.Rolodex.spin2win) - 1)) { // This is the game panel
                            $('#launch-game').click();
                        }
                    },
                    // Runs on "Next" btn click
                    navNext         : function (e, params){
                        var
                        panel = params.panel,
                        pIndex = params.pIndex,
                        qIndex = params.qIndex,
                        type = params.type;
                        // var options = App.Promotion.view.get('panels[' + index + '].options');
                        
                        if (type === 'panel' || type === 'question'){
                            var form = panel + '-form';
                            var submitOptions = {
                                job: App.User.job,
                                key: App.User.key,
                                panel: panel,
                                pIndex: pIndex,
                                qIndex: qIndex,
                                form: form,
                                type: type
                            };

                            var
                            action = $(form).attr('action'),
                            submitUrl = action + '/' + App.User.key;

                            /**
                             * Try submitting the form.
                             * Validation runs pre-submit.
                             */
                            try {
                                var submit = $(form).ajaxSubmit({
                                    data: submitOptions,
                                    // url: submitUrl || action,
                                    beforeSubmit: function (arr, $form, options){
                                        console.log('Running beforeSubmit');
                                        // Return false to cancel submit
                                        // Form data array is an array of objects with name and value properties - ex: [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
                                        var opts;
                                        if (typeof options.data === 'string') {
                                            opts = $.parseJSON(options.data);
                                        } else {
                                            opts = options.data;
                                        }
                                        /**
                                         * Run Form Validation
                                         */
                                        var vOptions;
                                        var pIndex = opts.pIndex;
                                        var qIndex = opts.qIndex;
                                        // var qIndex = --origQIndex;
                                        var type = opts.type;

                                        if (type === 'panel'){
                                            vOptions = App.Promotion.view.get('panels[' + pIndex + '].options');
                                        } else if (type === 'question') {
                                            vOptions = App.Promotion.view.get('panels[' + opts.pIndex + '].questions[' + opts.qIndex + '].options');
                                        }

                                        $.extend(true, vOptions, { ignore: '.ignore' });

                                        var result = 'novalidate';

                                        // adding robot check
                                        if($('#username').val() != ''){
                                            // var result = 'novalidate';
                                            return false;
                                        }

                                        console.log('vOptions', vOptions);

                                        if (vOptions) {
                                            try {
                                                $(form).validate(vOptions);
                                                result = $(form).valid();
                                            } catch (error) {
                                            	console.error('Error:', error.message);
                                            }
                                        } 

                                        console.log('result, options', {result: result, options: opts});
                                        if (result === true) { // Form is VALID
                                            
                                            // Hack for new customer creation. The new customer key will
                                            // not be set when beforeSubmit is initially triggered, since
                                            // the customer key is created during validation.
                                            // 
                                            // Check if the key now exists after the validation succeeded,
                                            // and try to submit again.
                                            console.log('opts.key', opts.key);
                                        	if (opts.panel == "#registration" && (typeof opts.key === 'undefined' || String(opts.key).substr(String(opts.job).length, 1) === '-')) {
                                                console.log('Changing key for submission', {opts: opts, user: App.User});
                                                // console.log('Key Substr', opts.key.substr(String(opts.job).length, 1));
                                                opts.key = App.User.key;
                                                $("#panels").trigger('navNext', params);
                                                
                                                return false;
                                            }

                                            $(form).removeClass('invalidated').addClass('validated');

                                            if (type === 'panel'){
                                                $(form).trigger('navNextValid', {
                                                    panel: App.Promotion.view.get('panels[' + pIndex + ']'),
                                                    pIndex: pIndex,
                                                    type: type
                                                });
                                            } else {
                                                var qOptions = {
                                                    panel: App.Promotion.view.get('panels[' + pIndex + ']'),
                                                    index: pIndex,
                                                    count: App.Promotion.view.get('panels[' + pIndex + '].questions.length'),
                                                    hide: App.Promotion.view.get('panels[' + pIndex + '].questions[' + qIndex + ']'),
                                                    show: App.Promotion.view.get('panels[' + pIndex + '].questions[' + (qIndex + 1) + ']'),
                                                    type: type
                                                };

                                                $("#panels").trigger('navNextQuestion', qOptions);
                                            }
                                        } else if (result === 'novalidate') { // Form does not get validated
                                            $(form).removeClass('invalidated').addClass('validated');
                                            
                                            try {
                                                $(form).trigger('navNextValid', {
                                                    panel: App.Promotion.view.get('panels[' + pIndex + ']'),
                                                    pIndex: pIndex
                                                });
                                            } catch (error) {
                                                console.error('Error:', error.message);
                                            }
                                        } else { // Form is INVALID
                                            $(form).removeClass('validated').addClass('invalidated');
                                            return false;
                                        }
                                    },
                                    success: function (response, status, xhr, $el){
                                        var self = this;
                                        // console.log("Submit Success!");
                                        // console.log('Submit Success', {
                                        //     // response: response,
                                        //     status: status,
                                        //     xhr: xhr,
                                        //     $el: $el
                                        // });
                                        App.User.refresh(App.User.key);
                                    }
                                });
                            } catch (error) {
                                console.error('Error:', error.message);
                            }
                        } else if (type === 'qcontainer'){
                            var valid = params.valid;
                            var form = panel + '-form';
                            var submitOptions = {
                                panel: panel,
                                pIndex: pIndex,
                                job: App.User.job,
                                key: App.User.key,
                                form: form
                            };

                            /**
                             * Try submitting the form.
                             * Validation runs pre-submit.
                             */
                            try {
                                var submit = $(form).ajaxSubmit({
                                    data: submitOptions,
                                    // url: submitUrl,
                                    success: function (response, status, xhr, $el){
                                        // console.log("Submit Success!");
                                        // console.log('Submit Success Options', {
                                        //     response: response,
                                        //     status: status,
                                        //     xhr: xhr,
                                        //     $el: $el
                                        // });
                                        // data = $.parseJSON(self.data);
                                        data = submitOptions;

                                        if (Number(data.pIndex) < Number(App.Rolodex.spin2win)) {
                                            Internal.calcSpinsEarnedForThisPanel(App, data.pIndex);
                                        }

                                        App.User.refresh(App.User.key);
                                        $(form).trigger('navNextValid', submitOptions);
                                    }
                                });
                            } catch (error) {
                                console.error('Error:', error.message);
                            }
                        }
                    },
                    navLeft         : function (e, el) {},
                    navRight        : function (e, el) {},
                    navUp           : function (e, el) {},
                    navDown         : function (e, el) {},
                    navNextQuestion : function (e, params) {
                        var qCount = params.count;
                        var hideIndex = params.hide.qIndex;
                        var showIndex = params.show.qIndex;
                        var hide = '#' + params.hide.floorName;
                        var show = '#' + params.show.floorName;

                        if (hideIndex === (qCount - 1)) { // This is the next-to-last panel
                            // Hide the 'Skip Section' Button
                            if ($('.skip-questions').css('display') === 'block')
                                $('.skip-questions').fadeOut(400);
                        }

                        if (hideIndex === qCount || show === undefined){ // Means this is the last question
                            Internal.calcSpinsEarnedForThisPanel(App,params.show.pIndex );

                            // Hide the 'Skip Section' Button
                            if ($('.skip-questions').css('display') === 'block')
                                $('.skip-questions').fadeOut(400);

                            var eventOptions = {
                                panel: App.Promotion.view.get('panels[' + params.show.pIndex + ']'),
                                index: params.show.pIndex,
                                type: 'panel'
                            };

                            $('#panels').trigger('navNextValid', eventOptions);

                        } else {
                            try {
                                $(hide).fadeOut({
                                    duration: 400,
                                    complete: function (){
                                        $(show).fadeIn(400);
                                    }
                                });
                            } catch (error) {
                                console.error('Error:', error.message);
                            }
                        }
                    },
                    navPrevQuestion : function (e, params){
                        var qCount = params.count;
                        var hideIndex = params.hide.qIndex;
                        var showIndex = params.show.qIndex;
                        var hide = '#' + params.hide.floorName;
                        var show = '#' + params.show.floorName;

                        console.log('Indexes', {s: showIndex, h: hideIndex});
                        if (hideIndex === 0 || show === undefined){ // Means this is the first question
                            var eventOptions = {
                                panel: App.Promotion.view.get('panels[' + params.show.pIndex + ']'),
                                index: params.show.pIndex
                            };

                            $('#panels').trigger('navPrevValid', eventOptions);
                        } else {
                            // Show the 'Skip Section' Button
                            if ($('.skip-questions').css('display') === 'none')
                                $('.skip-questions').fadeIn(400);

                            try {
                                $(hide).fadeOut({
                                    duration: 400,
                                    complete: function (){
                                        $(show).fadeIn(400);
                                    }
                                });
                            } catch (error) {
                                console.error('Error:', error.message);
                            }
                        }
                    }
                });

                /**
                 * Setup SpinCounter Event Listeners
                 */
                try {
                    $('#spin-counter').on('addSpins', function (e, params, typeadd){
                        var
                        spins,
                        currentSpins = App.SpinCounter.view.get('spins');
                        
                        if (typeof params === 'object') {
                            var
                            panel,
                            newTotal,
                            index = params.index,
                            panel = App.Promotion.view.get('panels[' + index + ']');

                            if (params.spins && params.spins !== undefined){
                                spins = params.spins;
                            } else {
                                spins = panel.spins.count;
                            }
                        } else {
                            var index = $("section[name=share]").data("index");
                            spins = params;
                        }

                        
                        if(typeadd == 'socialShare' && hasShared == 0){
                            hasShared++;
                            spins = spins;
                        }else if(typeadd == 'socialShare' && hasShared != 0){
                            spins = 0;
                        }

                        newTotal = spins + currentSpins;
                        App.SpinCounter.view.set('spins', newTotal);
                        App.Promotion.view.set('panels[' + index + '].spins.added',true);
                        
                    });
                } catch (error) {
                    console.error('Error:', error.message);
                }

                /**
                 * Run Modal Window Config(s)
                 */
                try {
                    Internal.runModalSetups();
                } catch (error) {
                    console.error('Error:', error.message);
                }

                /**
                 * Setup events to fire modal(s)
                 */
                try {
                    $('.fireModal').each(function (){
                        var
                        target = $(this).data('target'),
                        $target = $(target),
                        gameUrl = $(this).data('url');

                        if (!gameUrl) {
                            gameUrl = '';
                        }

                        $(this).on('click', function (e){
                            $(App).trigger('fireModal', [
                                e.currentTarget,
                                target,
                                gameUrl
                            ]);
                            e.preventDefault();
                            return false;
                        });
                    });
                } catch (error) {
                    console.error('Error:', error.message);
                }

                try {
                    $(App).on({
                        fireModal: function (e, currentTarget, target, url) {
                            if (target === '#game-modal') {
                                $(App).trigger('launchGame');
                            } else {
                                this.fireModal(e, target, url);
                            }
                        },
                        launchGame: function (e) {
                            var
                            root,
                            settings,
                            jsonData,
                            jsonString,
                            index = $('section[name="spin2win"]').data('index'),
                            launched = App.Promotion.view.get('panels['+ index +'].gameLaunched');

                            $('.fw-iframe').css({
                                height: window.innerHeight - 30
                            });

                            // Need to load the game's settings JSON file and parse the results
                            $.ajax({
                                url: '../game/data/json_'+ App.Client.slotgame.theme +'.json',
                                dataType: 'json',
                                beforeSend: function (){
                                    var settingsUrl;
                                    settingsUrl = Internal.formatRelativeUrl('game/data/json_' + App.Client.slotgame.theme + '.json');
                                    this.url = settingsUrl;
                                },
                                success: function (data) {
                                    jsonData = data;
                                    settings = data.settings;
                                }
                            }).done(function (){
                                var
                                logoUrl,
                                newUrl = App.Promotion.view.get('panels['+ index +'].gameUrl') + '?project=' + App.Client.slotgame.theme;

                                if (App.Client.slotgame.logo)
                                    logoUrl = Internal.formatRelativeUrl(App.Client.slotgame.logo);
                                else
                                    logoUrl = 'images/'+ App.Client.slotgame.theme +'/logo.png';
                                // console.log('Slot Game Logo URL', logoUrl);                                
                                newUrl += '&logo='+ logoUrl;
                                // newUrl += logoUrl || 'images/'+ App.Client.slotgame.theme +'/logo.png';

                                var
                                spins = App.SpinCounter.view.get('spins'),
                                ratio = settings.credit_equal,
                                credits = spins * ratio;
                                newUrl += '&coins='+ credits + '&credit_equal=' + ratio;

                                newUrl += '&jobs_no=' + App.Client.job + '&customer=' + App.User.key + '&kiosk=' + App.Client.hasKiosk;

                                document.getElementById('slots-game').src = Internal.formatRelativeUrl(newUrl);
                                $('#slots-game').responsiveIframe({ xdomain: '*' });
                            });

                            try {
                                App.Promotion.view.set('panels['+ index +'].gameLaunched', true);
                            } catch (error) {
                                console.error('Error:', error.message);
                            }

                            if (launched === false) {
                                this.fireModal(e, '#game-modal');
                            }
                        }
                    });
                } catch (error) {
                    console.error('Error:', error.message);
                }

                /**
                 * Slot Game Winner Listener
                 * 
                 * @event $body#slotWinner
                 * @param {event} e
                 * @param {boolean} isWinner
                 * @param {array} combination
                 */
                $(document).on({
                    slotWinner: function (e, prize, isDefault, combination, claimCode) {
                        /**
                         * Send Result Email
                         */
                        var
                        email = $('#email').val(),
                        name = $('#firstname').val(),
                        client = App.Client,
                        claim_code = this.claimCode,
                        message = "",
                        subject = "";
                        // console.log'job number', App.User.job);
                        $.post('Email/send', {
                            email: email,
                            message: message,
                            subject: subject,
                            claimCode: claim_code,
                            job: App.User.job,
                            kiosk: App.Client.hasKiosk ? 'yes' : 'no',
                            status: (isDefault) ? 'lose' : 'win'
                        },function (data){
                            //console.log();
                        });

                        App.Promotion.view.set('panels['+ App.Rolodex.thankYou +'].winner', !isDefault);
                        App.Promotion.view.set('panels['+ App.Rolodex.thankYou +'].claimCode', claimCode);

                        if (!isDefault && !App.Client.hasKiosk) {
                            App.Promotion.view.set('panels['+ App.Rolodex.thankYou +'].winnerFields.noKioskFields.prize_head', 'You won ' + prize.prize.name + '!');
                            App.Promotion.view.set('panels['+ App.Rolodex.thankYou +'].winnerFields.noKioskFields.prize_image', prize.prize.image);
                            App.Promotion.view.set('panels['+ App.Rolodex.thankYou +'].winnerFields.noKioskFields.prize_text', 
                                '<a href="http://www.fatwin.com/" target="_blank">Fatwin.com</a> redemption code: ' + claimCode
                            );
                        }
                        
                        var
                        tpl = App.Promotion.view.get('panels['+ App.Rolodex.thankYou +'].template'),
                        tplVars = App.Promotion.view.get('panels['+ App.Rolodex.thankYou +']');
                        App.Promotion.view.set('panels['+ App.Rolodex.thankYou +'].renderedTpl', Internal.compile(tpl, tplVars));

                        $('section[name=spin2win] .panelsLinkNext').click();
                    },
                    slotResult: function (e, isWinner, combination) {
                        App.Promotion.view.set('panels['+ App.Rolodex.thankYou +'].winner', false);
                    },
                    dateSelected: function (e, formattedDate, dateObj, el) {
                        var
                        url = App.Internal.formatRelativeUrl('Client/hours/'+ App.User.job),
                        date = moment(dateObj);
                        
                        $.ajax({
                            url: url,
                            data: {
                                day: date.format('dddd')
                            },
                            method: 'post',
                            dataType: 'json',
                            success: function (data){
                                var i, times = [];
                                // console.log'Get Hours Data', {data: data});
                                for (i in data) {
                                    var _time, time, hour, hourArr, minute;

                                    if (data[i] != 'Closed') {
                                        hourArr = data[i].split(':'); // Split the times received as strings ["09:00", ..., "17:00", etc.]
                                        hour = Number(hourArr[0]); // Get the hour
                                        minute = Number(hourArr[1]); // Get the minutes
                                        
                                        _time = date.hour(hour).minute(minute);
                                        time = moment(_time).format('h:mm a');
                                    } else {
                                        time = 'Closed';
                                    }

                                    times.push(time);
                                }
                                App.Internal.renderSelectOptions(times, '#apptTime');
                            }
                        });
                    }
                });

                try {
                    /**
                     * Initialize Ascensor panels
                     */
                    // console.log('floornames', floorNames);
                    App.Ascensor = $('#panels').ascensor({
                        ascensorName            : 'panels',                                             // Used for class && Selector                                       (default: ascensor)
                        childType               : 'section',                                            // Specify child tag of ascensor div                                (default: div)
                        direction               : 'y',                                                  // Can be 'x', 'y', or 'chocolate'                                  (default: 'y')
                        easing                  : 'linear',                                             // Easing animation to use                                          (default: linear)
                        overflow                : 'hidden',                                             // Overflow property for main container                             (default: scroll)
                        keyNavigation           : false,                                                // Can use keyboard for navigation?                                 (default: true)
                        loop                    : false,                                                // Specify whether or not to loop panels                            (default: true)
                        time                    : 400,                                                  // Specify speed of transition(s)                                   (default: 1000)
                        ascensorFloorName       : floorNames                                            // Name each "floor" ["panel"]                                      (default: null)
                        // ascensorMap          : [[0,0], [0,1], [0,2], [0,3], [1,3], [1,4]],           // If using 'chocolate' for direction, specify position(s) for x/y  (default: null)
                        // queued               : false,                                                // Queue direction scroll or not                                    (default: false)
                        // queuedDirection      : 'x',                                                  // Choose if you want direction scroll queued 'x' or 'y'            (default: x)
                        // windowsOn            : 1                                                     // Choose the starting "floor" ["panel"]                            (default: 1)
                    });
                } catch (error) {
                    console.error('Error:', error.message);
                }

                $('#redirector').redirector({
                    url: App.Client.website,
                    seconds: 15
                });

                /** 
                 * Notify app of the floor being viewed
                 */
                $(document).on('scrollEnd', function (e, floor) {
                    console.log('scrollEnd', floor);
                    App.ActiveFloor = floor.to;
                    console.log('Active Floor', {
                        idx: App.ActiveFloor,
                        panel: App.Promotion.view.get('panels['+ App.ActiveFloor +']')
                    });
                });

                try {
                    App.Rolodex.init(App.Promotion.view.get('panels'));
                } catch (error) {
                    console.error('Error:', error.message);
                }

                try {
                    /**
                     * Set Promotion event listeners
                     */
                    App.Promotion.view.on({
                        update: function (e) {
                            // console.log'Update happened!');
                        },
                        input: function (e) {
                        },
                        socialLogin: function (data) {
                        },
                        fireModal: function (e) {
                            return App.fireModal(e);
                        },
                        updateData: function (e, module, uri, value, force) {
                            if (!force){
                                force = false;
                            }

                            if (/[A-Z]/.test(module[0]) === false){
                                module[0].toUpperCase();
                            }
                            var scope = App[module].view;

                            if (typeof scope.get(uri) !== 'undefined' || (typeof scope.get(uri) === 'undefined' && force === true)){
                                scope.set(uri, value);
                            } else {
                                throw "Given URI does not exist. Cannot update data.";
                            }
                        }
                    });
                } catch (error) {
                    console.error('Error:', error.message);
                }

                /**
                 * Mission Control Prize Img Rotator Init
                 */
                try {
                    $('#prize-rotator').liquidSlider({
                        autoHeight: false,
                        continuous: true,
                        autoSlide: true,
                        autoSlideControls: true,
                        forceAutoSlide: true,
                        pauseOnHover: true,
                        useCSSMaxWidth: 200,
                        keyboardNavigation: true,
                        includeTitle: false,
                        dynamicTabs: false,
                        dynamicTabsHtml: false
                    });
                } catch (error) {
                    console.error('Error:', error.message);
                }

                try {
                    /**
                     * Set MissionControl event listeners
                     */
                    App.MissionControl.view.on({
                        fireModal: function (e){
                            return App.fireModal(e);
                        }
                    });
                } catch (error) {
                    console.error('Error:', error.message);
                }

                try {
                    fb.init(App.Client.environment);
                    myGplus.setEnvir(App.Client.environment);
                    myTwitter.init();
                    //myGplus.init();
                    //myGplus.init();
                } catch (error) {
                    console.error('Error:', error.message);
                }

                // tolken for gplus
                var gtolken;
                $('.social-button').on({
                    click: function (e){
                        var network = $(this).data('network');

                        //facebook
                        if(network === "fb"){
                            fb.loginfb();
                        }
                        //twitter
                        if(network === "twitter"){
                             var t = "good";
                             var test;
                             var url = myTwitter.makeUrl();
                            $.get('social/twitteroauth/myget.php', function (test2){
                                test = test2;
                            }).done(function (){
                                if(test == "null"){
                                    window.document.location.replace('social/twitteroauth/redirect.php');
                                    return false;
                                }else{
                                    $.getJSON('social/twitteroauth/index.php', function (data, status, xhr){
                                         //$('#firstname').val(data.name);
                                        if(typeof(data.name) != "undefined"){
                                            var tmp = data.name;
                                            var first = tmp.substr(0,tmp.indexOf(' '));
                                            var last = tmp.substr(tmp.indexOf(' ')+1);
                                            $('#firstname').val(first);
                                            $('#lastname').val(last);
                                        }
                                    });
                                }
                            });
                            
                        }
                        // google plus
                        if(network === "gplus"){
                            myGplus.handleAuthClick();
                        }

                        if(network === "fatwin") {
                            $('.registration').hide();
                            $('input,select,textarea', '.registration').addClass('ignore');
                            $('input,select,textarea', '.login').removeClass('ignore');
                            $('.login').fadeIn(150);
                        }

                        e.preventDefault();
                        return false;
                    }
                });

                $('#login-back').on({
                    click: function (e) {
                        $('.login').hide();
                        $('input,select,textarea', '.registration').removeClass('ignore');
                        $('input,select,textarea', '.login').addClass('ignore');
                        $('.registration').fadeIn(150);
                        e.preventDefault();
                    }
                });

                // just adds a spin for social
                $('#pinshare').on({
                    click: function (){
                        $('#spin-counter').trigger('addSpins', [2,"socialShare"] );
                        //alert('social share add spin pinshare');
                    }
                });
                // sharing engage!
                $('.social-share').on({
                    click: function (e){
                        var network = $(this).data('network');
                        var pIndex = $('.buttons',$(this).parent()).data('pindex');

                        surl = "http://www."+App.Client.job+"fatwin.com/share?ref="+App.User.key;
                        //App.Internal.formatRelativeUrl()
                        if(network === "fb"){
                            fb.sharethis(App,pIndex,surl);
                        }

                        if(network === "gplus"){
                            myGplus.gshare(App,surl);

                        }

                        if(network === "twitter"){
                            //myTwitter.tweetUs();
                        }
                        
                    }
                });

                $('#notifications').on({
                    click: function (event) {
                        /* Act on the event */
                        var email = $('#email').val();
                        var message = "Thank you for registering with Fatwin";
                        // $.post('Email/send',{email:email,message:message},function (data){
                        //     console.log();
                        // });
                    }
                });

                $('#botcheck').on({
                    change: function (e){

                    }
                });

                /**
                 * Prevent empty links from opening a new tab
                 */
                $('a[href="#"]').on('click', function (e){
                    if (typeof $(this).attr('id') === 'undefined' &&
                        typeof $(this).attr('class') === 'undefined')
                        e.preventDefault();

                    return true;
                }); 
                
                /**
                 * Tell the Progress Bar that the load is complete
                 */
                NProgress.done();

                return App;
            });

            /**
             * Init Compatibility features
             */
            App.Compatibility.init();
            
            /**
             * NADA Estimates Listeners & Data Persistence Methods
             */
            $(function (){
                var
                nada = App.Promotion.functions.nada,
                $survey = $('#nada-survey-wrap'),
                $values = $('#nada-value-wrap'),
                // pIndex = $('section[name=qContainer]').data('index'),
                pIndex = Number(App.Rolodex.qContainer),
                qIndex = $('.nada:first-child').data('qindex') - 1,
                qUri = 'panels['+ pIndex +'].questions['+ qIndex +']',
                fUri = 'panels['+ pIndex +'].questions['+ qIndex +'].fields';
                
                $('body').on({
                    YearSelected: function (e, year){
                        // var options = App.Promotion.view.get(fUri + '.make.getOptions');
                        var options = nada.getOptions('make', {
                            year: year
                        });

                        App.Promotion.view.set(fUri + '.make.options');
                    },
                    MakeSelected: function (e, year, make){
                        // var options = App.Promotion.view.get(fUri + '.model.getOptions');
                        var options = nada.getOptions('model', {
                            year: year,
                            make: make
                        });

                        App.Promotion.view.set(fUri + '.model.options', options);
                    },
                    ModelSelected: function (e, year, make, model){
                        var value = nada.getEstimate(year, make, model);

                        App.Promotion.view.set(fUri + '.value', value);
                    },
                    renderOptions: function (e, property, options){
                        try {
                            nada.renderOptions(property, options);
                        } catch (error) {
                            console.error('Error:', error.message);
                        }
                    },
                    showEstimate: function (e){
                        App.Promotion.view.set(fUri + '.estVisible', true);
                        
                        $survey.fadeOut({
                            duration: 400,
                            complete: function (){
                                $values.fadeIn(400);
                            }
                        });

                        var
                        idx = Number(App.Rolodex.NadaDetails),
                        nada = App.Promotion.view.get('panels['+ idx +']'),
                        detailsTpl = App.Promotion.view.get('panels['+ idx +'].template');

                        // App.User.year = $('#year').val();
                        // App.User.make = $('#make').val();
                        // App.User.model = $('#model').val();
                        var
                        year = $('#year').val(),
                        make = $('#make').val(),
                        model = $('#model').val();

                        App.User.vehicle = year +' '+ make +' '+ model;
                        App.User.value = $('#estimated-value').val();
                        App.User.bonus = $('#trade-bonus').val();
                        App.User.tradeTotal = $('#trade-total').val();

                        App.Promotion.view.set('panels['+ idx +'].offer.user', App.User);
                        App.Promotion.view.set('panels['+ idx +'].renderedTpl', Internal.compile(detailsTpl, App.Promotion.view.get('panels['+ idx +']')));
                    },
                    hideEstimate: function (e){
                        App.Promotion.view.set(fUri + '.estVisible', false);
                        
                        $values.fadeOut({
                            duration: 400,
                            complete: function (){
                                $survey.fadeIn(400);
                            }
                        });
                    },
                    toggleEstimate: function (e){
                        var visible = App.Promotion.view.get(fUri + '.estVisible');
                        if (visible === true){
                            $(this).trigger('hideEstimate');
                        } else {
                            $(this).trigger('showEstimate');
                        }
                    }
                });
            });

            return App;
        },
        setupForms: function (){
            //robot check

            /**
             * Setup all of the forms with our AJAX Forms plugin.
             * This plugin allows us to setup AJAX submission for each individual form,
             * as well as combine the rules for form validation with all of our other form functions.
             */
            $('form').ajaxForm({
                delegation: true
            });
        },
        tw_share: function (){
            // alert('twitter tweet! add spin');
        }
    });

    /* 
     * Format a given number as currency
     * 
     * @param decimal_sep       decimal separator    Defaults to '.'
     * @param thousands_sep     thousands separator  Defaults to ','
     */
    Number.prototype.toCurrency = function (decimals, decimal_sep, thousands_sep) { 
       var
       n = this,
       c = isNaN(decimals) ? 2 : Math.abs(decimals), // If decimal is zero we must take it, don't show decimal
       d = decimal_sep || '.', // If no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)
       t = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep, // If you don't want to use a thousands separator you can pass empty string
       sign = (n < 0) ? '-' : '',

       //extracting the absolute value of the integer part of the number and converting to string
       i = parseInt(n = Math.abs(n).toFixed(c)) + '', 
       j = ((j = i.length) > 3) ? j % 3 : 0;

       return '$' + sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ''); 
    }

    String.prototype.capitalize = function (str) {
        var
        self = this,
        str = str.trim(),
        first = str[0];

        return first.toUpperCase() + str.substr(1);
    }

    /**
     * Add to the window (global) namespace for debugging
     */
    window.App = App;
    App.Internal = Internal; // Only for debugging

    /**
     * Return the newly running App instance from the call to App.init() in main.js
     */
    return App;
});
