define([
], function(){

    'use strict';
    
    return function(job){
        var client;
        
        $.ajax({
            url: 'Client/job/' + job,
            async: false,
            dataType: "json"
        }).done(function(data) {
            client = data;
        });

        return client;
    }
});