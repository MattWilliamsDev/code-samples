define([
    'jQuery',
    'Mustache',
    'Modal',
    'moment'
], function(jQuery, Mustache, Modal, moment){
    
    // 'use strict';

    var Internal = {
        compile: function (tpl, data){
            var rendered;

            try {
                rendered = Mustache.render(tpl, data);
            } catch (error) {
                console.error('Error:', error.message);
            };

            // console.log('Rendered', rendered);
            
            return rendered;
        },
        formatRelativeUrl: function (link){
            var root, url, path;
            if (window.location.pathname) {
                path = window.location.pathname.split('/');
                if (path[0] == "") {
                    if (path[1] === 'instantwin' || path[1] === 'fatwin') {
                        root = '../' + path[1] + '/';
                        
                        url = root + link;
                        // console.log('Formatted URL', url);                        
                    } else {
                        url = link;
                    }
                }
            }

            return url;
        },
        fireModal: function(e) {
            var $node, data, defaults, options = {}, target, userOptions = {};
            e.original.preventDefault();

            $node = $(e.node);
            data = $node.data();
            
            // console.log('event', e);

            defaults = {
                backdrop: true,
                keyboard: true,
                show    : true,
                remote  : false
            };

            if (!data.target){
                data.target = $node.attr('href');
            }

            $.each(data, function(k, v){
                switch (k){
                    case 'target':
                        target = v;
                        break;

                    default:
                        userOptions[k] = v;
                        break;
                }
            });

            options = $.extend(defaults, userOptions);            
            try {
                $($node.attr('href')).modal(options);
            } catch (error) {
                console.error('Error:', error.message);
            }
        },
        runModalSetups: function(){
            var regs = $('#regulationsModal');

            regs.modal({
                backdrop: true,
                keyboard: true,
                show    : false,
                remote  : false
            });

            $('.modal-body', '#regulationsModal').mCustomScrollbar({
                advanced:{
                    updateOnContentResize: true
                }
            });
        },
        moment: function (args) {
            var date = moment(args);
            return date;
        },
        renderSelectOptions: function (data, el) {
            var
            $el = $(el),
            $opt = $('<option value=default/>');

            $el.html('');
            $opt.html('- Select One -');
            $el.append($opt);

            for (var k in data) {
                var $option = $('<option />');
                
                $option.val(data[k]).html(data[k]);
                $el.append($option);
            }
        },
        cappy: function (string) {
            return this.capitalizeFirstLetter(string);
        },
        capitalizeFirstLetter: function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        isAttributeSupported: function (tagName, attrName) {
            var val = false;
            // Create element
            var input = document.createElement(tagName);
            // Check if attribute (attrName)
            // attribute exists
            if (attrName in input) {
                val = true;
            }
            // Delete "input" variable to
            // clear up its resources
            delete input;
            // Return detected value
            
            return val;
        },
        isInputTypeSupported: function (typeName) {
            // Create element
            var input = document.createElement("input");
            // attempt to set the specified type
            input.setAttribute("type", typeName);
            // If the "type" property equals "text"
            // then that input type is not supported
            // by the browser
            var val = (input.type !== "text");
            // Delete "input" variable to
            // clear up its resources
            delete input;
            // Return the detected value
            
            return val;
        },
        calcSpinsEarnedForThisPanel : function(App,index){
        	var panel = App.Promotion.view.get('panels['+ index +']');
// console.log'calcSpinsEarnedForThisPanel', index);
        	if (panel.type !== 'share' && panel.floorName !== 'share') {
                if (typeof panel.spins !== 'undefined') {
                    if (panel.spins.added === false) {
                    	App.Promotion.view.set('panels['+ index +'].spins.added', true);
                        $('#launched').val(true);
                        $('#spin-counter').trigger('addSpins', { index: index, spins: panel.spins.count });
                    }                    
                }
            }
        }
    };

    return Internal;
});