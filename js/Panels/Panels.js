define([
    'jQuery',
    'Ractive',
    'Internal'
], function($, Ractive, Internal){

    'use strict';

    /**
     * Add new properties to the object here.
     * Extremely useful for firing functions from observed events.
     * 
     * Ex:
     * Promo = Ractive.extend({sync: function(){...});
     * promo = new Promo();
     * promo.on(function(e){ this.sync(); })
     */
    var Panels = Ractive.extend({
        data: {
            render: function(){
                return true;
            },
            format: function(string){
                return string.capitalize;
            },
            log: function(stuff){
                console.log('Logged by log() data function', stuff);
            }
        },
        redrawTemplate: function(tpl, data, qUri){
            console.log('redrawTemplate', {
                tpl: tpl,
                data: data,
                qUri: qUri
            });

            var qData = this.get(qUri);

            console.log('qData', qData);

            try {
                var rendered = Internal.compile(tpl, qData);
            } catch (error) {
                console.error('Error:', error.message);
            }

            this.set(qUri + '.renderedTpl', rendered);
            // this.update();
        },
        toObject: function(array){
            var rv = {};

            for (var i = 0; i < array.length; ++i)
                if (array[i] !== undefined) rv[array.floorName] = array[i];
            
            return rv;
        }
    });

    return Panels;
});