'use strict';

var unirest = require('unirest');
var colors = require('colors');

var params = {
    host: 'http://localhost:3000',
    ieeeAddress: '124b0001dd40ec',
    endpointId: 11,
    clusterId: 'On%2fOff',
    attributeId: 'OnOff'
};

function printRes (response) {
    if (!response.error) {
        console.log(response.body);
    } else {
        console.log(colors.red(response.error));
    }
}

var requests = [
    function(next) {
        return function() {
            console.log('/api/endpoints/:ieeeAddress/:endpointId'.cyan);
            unirest.get(params.host + '/api/endpoints/' + params.ieeeAddress + '/' + params.endpointId)
                .header('Accept', 'application/json')
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/endpoints/:ieeeAddress/:endpointId/commands addGroup'.cyan);
            unirest.post(params.host + '/api/endpoints/' + params.ieeeAddress + '/' + params.endpointId + '/commands')
                .header('Accept', 'application/json')
                .type('json')
                .send({command:"addGroup",params:{groupId:10}})
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/api/endpoints/:ieeeAddress/:endpointId'.cyan);
            unirest.get(params.host + '/api/endpoints/' + params.ieeeAddress + '/' + params.endpointId)
                .header('Accept', 'application/json')
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/endpoints/:ieeeAddress/:endpointId/commands removeGroup'.cyan);
            unirest.post(params.host + '/api/endpoints/' + params.ieeeAddress + '/' + params.endpointId + '/commands')
                .header('Accept', 'application/json')
                .type('json')
                .send({command:"removeGroup",params:{groupId:10}})
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/api/endpoints/:ieeeAddress/:endpointId'.cyan);
            unirest.get(params.host + '/api/endpoints/' + params.ieeeAddress + '/' + params.endpointId)
                .header('Accept', 'application/json')
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function end() {
        console.log('end'.green);
    }
];



var chain = requests.reduceRight(function(previousValue, currentValue) {
    return currentValue(previousValue);
});

chain();