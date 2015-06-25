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
            console.log('/attributes/:ieeeAddress/:endpointId/:clusterId/:attributeId'.cyan);
            unirest.get(params.host + '/api/attributes/' + params.ieeeAddress + '/' + params.endpointId + '/' + params.clusterId + '/' + params.attributeId)
                .header('Accept', 'application/json')
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/clusters/:ieeeAddress/:endpointId/:clusterId/commands On'.cyan);
            unirest.post(params.host + '/api/clusters/' + params.ieeeAddress + '/' + params.endpointId + '/' + params.clusterId + '/commands')
                .header('Accept', 'application/json')
                .type('json')
                .send({command:"On",params:{}})
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/attributes/:ieeeAddress/:endpointId/:clusterId/:attributeId/read'.cyan);
            unirest.post(params.host + '/api/attributes/' + params.ieeeAddress + '/' + params.endpointId + '/' + params.clusterId + '/' + params.attributeId + '/read')
                .header('Accept', 'application/json')
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/attributes/:ieeeAddress/:endpointId/:clusterId/:attributeId'.cyan);
            unirest.get(params.host + '/api/attributes/' + params.ieeeAddress + '/' + params.endpointId + '/' + params.clusterId + '/' + params.attributeId)
                .header('Accept', 'application/json')
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            setTimeout(function() {
                next();
            }, 500);
        }
    },
    function(next) {
        return function() {
            console.log('/clusters/:ieeeAddress/:endpointId/:clusterId/commands Off'.cyan);
            unirest.post(params.host + '/api/clusters/' + params.ieeeAddress + '/' + params.endpointId + '/' + params.clusterId + '/commands')
                .header('Accept', 'application/json')
                .type('json')
                .send({command:"Off",params:{}})
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/attributes/:ieeeAddress/:endpointId/:clusterId/:attributeId/read'.cyan);
            unirest.post(params.host + '/api/attributes/' + params.ieeeAddress + '/' + params.endpointId + '/' + params.clusterId + '/' + params.attributeId + '/read')
                .header('Accept', 'application/json')
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/attributes/:ieeeAddress/:endpointId/:clusterId/:attributeId'.cyan);
            unirest.get(params.host + '/api/attributes/' + params.ieeeAddress + '/' + params.endpointId + '/' + params.clusterId + '/' + params.attributeId)
                .header('Accept', 'application/json')
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            setTimeout(function() {
                next();
            }, 500);
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