define([
    'Internal'
], function (Internal) {

    return {
        init: function () {
            var
            self = this,
            polyfills = {},
            features = {};

            $(function (){
                for (var k in self.checkSupport) {
                    if (self.checkSupport.hasOwnProperty(k) && k != 'byType') {
                        
                        var
                        obj = self.checkSupport[k],
                        supported = false;

                        // console.log('self.checkSupport obj', {obj: obj, call: obj.call(this, arguments)});
                        
                        if (typeof obj === 'function') {

                            supported = obj.call(this, arguments);
                            // console.log('supported', supported);

                            if (supported === true) {
                                features[k] = supported;
                            } else {
                                polyfills[k] = self.polyfills[k];
                            }

                        } else if (typeof obj === 'object') {
                            
                            for (var prop in obj[k]) {
                                if (obj.hasOwnProperty(prop)) {
                                    supported = obj[prop].call(this, arguments);
                                }

                                if (supported === true) {
                                    features[prop] = supported;
                                } else {
                                    console.log('self.polyfills[k]', {fills: self.polyfills[prop], k: k});
                                    polyfills[prop] = self.polyfills[prop];
                                }
                            }

                        }
                        
                        // console.log('support and fills', {features: features, polyfills: polyfills});
                    }
                }
            
                self.supported = features;
                // console.log('Supported Features', self.supported);

                for (var func in polyfills) {
                    if (self.polyfills.hasOwnProperty(func)) {
                        
                        var run = self.polyfills[func];
                        
                        if (typeof run === 'function') {
                            run.call(this, arguments);
                        } else {
                            console.error('Invalid Polyfill type', run);
                        }
                    
                    }
                }
            });
        },
        supported: {},
        checkSupport: {
            placeholder: function () {
                $.support.placeholder = false;
                test = document.createElement('input');
                
                if('placeholder' in test)
                    $.support.placeholder = true;

                return $.support.placeholder;
            },
            byType: function (type) {
                return Internal.isInputTypeSupported(type);
            }
        },
        polyfills: {
            placeholder: function () {
                $('.cf input:not(:hidden), .cf input[type=date], .cf textarea, .cf select').each(function (){
                    try {
                        if ($(this).attr('placeholder') != '' && $(this).val() == '') {
                            $(this).val($(this).attr('placeholder'));
                        }
                    } catch (error) {
                        console.error('Error:', error.message);
                    }
                });
            }
        }
    }

});