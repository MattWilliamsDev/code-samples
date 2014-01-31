define([
    // 'jQuery',
    'Ractive',
    'rv!TPL/inputs/dropdown'
], function(Ractive, defaultTemplate){

    'use strict';

    return function(data){
        var obj = {
            name        : 'input-name',
            id          : 'input-id',
            label       : 'Input Label',
            placeholder : 'Placeholder Text...',
            required    : false,
            options     : [
                { value: 'value1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' }
            ],
            validator   : function(){
                // Do something to validate...
                return true;
            },
            template    : defaultTemplate
        }

        $.extend(obj, data);

        return obj;
    }
});