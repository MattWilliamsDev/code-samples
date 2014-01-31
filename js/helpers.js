define(function (){
    
    'use strict';

    /**
     * Protect window.console method calls, e.g. console is not defined on IE
     * unless dev tools are open, and IE doesn't define console.debug
     */
    if (!window.console) {
        window.console = {};
    }

    var m = [
        "log", "info", "warn", "error", "debug", "trace", "dir", "group",
        "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
        "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
    ];

    for (var i = 0; i < m.length; i++) {
        if (!window.console[m[i]]) {
            window.console[m[i]] = function() {};
        }
    }

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
     * Toggle State Abbreviations
     */
    String.prototype.toggleAbbr = function (str) {
        var
        state,
        states = [
            {name:'Alabama', abbr:'AL'},
            {name:'Alaska', abbr:'AK'},
            {name:'Arizona', abbr:'AZ'},
            {name:'Arkansas', abbr:'AR'},
            {name:'Colorado', abbr:'CO'},
            {name:'Connecticut', abbr:'CT'},
            {name:'Florida', abbr:'FL'},
            {name:'Georgia', abbr:'GA'},
            {name:'Idaho', abbr:'ID'},
            {name:'Illinois', abbr:'IL'},
            {name:'Iowa', abbr:'IA'},
            {name:'Kansas', abbr:'KS'},
            {name:'Louisiana', abbr:'LA'},
            {name:'Maine', abbr:'ME'},
            {name:'Massachusetts', abbr:'MA'},
            {name:'Michigan', abbr:'MI'},
            {name:'Mississippi', abbr:'MS'},
            {name:'Missouri', abbr:'MO'},
            {name:'Nebraska', abbr:'NE'},
            {name:'Nevada', abbr:'NV'},
            {name:'New Hampshire', abbr:'NH'},
            {name:'New Jersey', abbr:'NJ'},
            {name:'New Mexico', abbr:'NM'},
            {name:'New York', abbr:'NY'},
            {name:'North Carolina', abbr:'NC'},
            {name:'North Dakota', abbr:'ND'},
            {name:'Oklahoma', abbr:'OK'},
            {name:'Oregon', abbr:'OR'},
            {name:'Rhode Island', abbr:'RI'},
            {name:'South Carolina', abbr:'SC'},
            {name:'South Dakota', abbr:'SD'},
            {name:'Tennessee', abbr:'TN'},
            {name:'Texas', abbr:'TX'},
            {name:'Vermont', abbr:'VT'},
            {name:'Virginia', abbr:'VA'},
            {name:'West Virginia', abbr:'WV'},
            {name:'Wisconsin', abbr:'WI'}
        ];

        $.each(states, function (idx) {
            if (str === this.name) { // Is a full state name & needs abbreviated (ex: 'Indiana')
                state = this.abbr; // Return the abbreviation (ex: 'IN')
                return false;
            } else if (str === this.abbr) { // Is a state abbr & needs unabbreviated (ex: 'MS')
                state = this.name; // Return the full state name (ex: 'Mississippi')
                return false;
            } else {
                state = str;
                return true;
            }
        });
        return state; // If no match found, return the regular string
    };
});