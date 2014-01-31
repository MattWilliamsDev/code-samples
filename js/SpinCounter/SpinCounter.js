define([
    'Ractive'
], function(Ractive){
    
    'use strict';

    return Ractive.extend({
        data: {
            format: function(string){
                string.capitalize();
            }
        },
        render: function(){
            return Mustache.render(SpinCounterTpl, this.get());
        }
    });
});