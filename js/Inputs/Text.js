define([
    'Ractive',
    'Mustache',
    'rv!TPL/inputs/text'
], function(Ractive, Mustache, InputTpl){

    'use strict';

    return function(data){
        var options, template;
        var defaults = {
            name        : 'TextInput Name',
            id          : 'textinput-id',
            className   : 'textinput',
            type        : 'text',
            label       : 'TextInput Label',
            placeholder : 'Placeholder Text...',
            required    : false,
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
            validator   : data.validator
        };

        options = $.extend(defaults, obj);

        return function(){
            return Mustache.render(InputTpl, options);
        }

        // return new Ractive({
        //     el          : $(data.el),
        //     template    : InputTpl,
        //     data        : options
        // });
    }
});