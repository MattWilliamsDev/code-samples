define([
    'Ractive',
    'Mustache',
    'text!TPL/inputs/manual.html',
    'text!TPL/inputs/social.html'
], function(Ractive, Mustache, ManualTpl, SocialTpl){

    'use strict';

    return function(){
        var Registration = {
            options: {},
            template: {},
            get: function(property){
                console.log('this', Registration);
                return Registration[property];
            },
            set: function(property, value){
                Registration[property] = value;
                return Registration;
            },
            render: function(template, options){
                console.log('Template', template);

                template = Mustache.render(template, options);
                this.set('template', template);

                return this;
            },
            init: function(data){
                var options, template, self;
                self = Registration;

                var socialOptions = {
                    fb      : true,
                    gplus   : true,
                    twitter : true,
                    fatwin  : false
                };

                var manualOptions = {
                    firstname   : true,
                    lastname    : true,
                    address     : true,
                    city        : true,
                    state       : true,
                    zip         : true,
                    email       : true,
                    phone       : true
                };

                var defaults = {
                    name        : 'TextInput Name',
                    id          : 'textinput-id',
                    className   : 'textinput',
                    type        : 'text',
                    label       : 'TextInput Label',
                    placeholder : 'Placeholder Text...',
                    required    : false,
                    options     : this.type === 'social' ? socialOptions : manualOptions,
                    validator   : function(){
                        // Do something to validate...
                        return true;
                    }
                };

                var obj = {
                    name        : data.name,
                    id          : data.id,
                    className   : data.className,
                    type        : data.type,
                    label       : data.label,
                    placeholder : data.placeholder,
                    required    : data.required,
                    validator   : data.validator,
                    options     : data.options,
                    fields      : data.fields
                };

                options = $.extend(defaults, obj);

                self.set('options', options);

                if (options.type === 'social') {
                    template = SocialTpl;
                } else {
                    template = ManualTpl;
                }

                self.set('template', template);
                self.render(template, options);
            }
        }

        return Registration;
    }
});