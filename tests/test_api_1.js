'use strict';

var unirest = require('unirest');
var colors = require('colors');

var params = {
    host: 'http://localhost:3000',
    endpointId: 11,
    clusterIds: [6, 'On%2fOff'],
    attributeIds: [0, 'OnOff']
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
            console.log('/api'.cyan);
            unirest.get(params.host + '/api')
                .header('Accept', 'application/json')
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/api/pan'.cyan);
            unirest.get(params.host + '/api/pan')
                .header('Accept', 'application/json')
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/api/devices'.cyan);
            unirest.get(params.host + '/api/devices')
                .header('Accept', 'application/json')
                .end(function (response) {
                    printRes(response);
                    params.ieeeAddress = response.body[1].ieeeAddress;
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/api/devices/:ieeeAddress'.cyan);
            unirest.get(params.host + '/api/devices/' + params.ieeeAddress)
                .header('Accept', 'application/json')
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/api/endpoints/:ieeeAddress'.cyan);
            unirest.get(params.host + '/api/endpoints/' + params.ieeeAddress)
                .header('Accept', 'application/json')
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
            console.log('/clusters/:ieeeAddress/:endpointId'.cyan);
            unirest.get(params.host + '/api/clusters/' + params.ieeeAddress + '/' + params.endpointId)
                .header('Accept', 'application/json')
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/clusters/:ieeeAddress/:endpointId/:clusterId num'.cyan);
            unirest.get(params.host + '/api/clusters/' + params.ieeeAddress + '/' + params.endpointId + '/' + params.clusterIds[0])
                .header('Accept', 'application/json')
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/clusters/:ieeeAddress/:endpointId/:clusterId str'.cyan);
            unirest.get(params.host + '/api/clusters/' + params.ieeeAddress + '/' + params.endpointId + '/' + params.clusterIds[1])
                .header('Accept', 'application/json')
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/attributes/:ieeeAddress/:endpointId/:clusterId'.cyan);
            unirest.get(params.host + '/api/attributes/' + params.ieeeAddress + '/' + params.endpointId + '/' + params.clusterIds[1])
                .header('Accept', 'application/json')
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/attributes/:ieeeAddress/:endpointId/:clusterId/:attributeId num'.cyan);
            unirest.get(params.host + '/api/attributes/' + params.ieeeAddress + '/' + params.endpointId + '/' + params.clusterIds[1] + '/' + params.attributeIds[0])
                .header('Accept', 'application/json')
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/attributes/:ieeeAddress/:endpointId/:clusterId/:attributeId str'.cyan);
            unirest.get(params.host + '/api/attributes/' + params.ieeeAddress + '/' + params.endpointId + '/' + params.clusterIds[1] + '/' + params.attributeIds[1])
                .header('Accept', 'application/json')
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/attributes/:ieeeAddress/:endpointId/:clusterId/:attributeId/read'.cyan);
            unirest.post(params.host + '/api/attributes/' + params.ieeeAddress + '/' + params.endpointId + '/' + params.clusterIds[1] + '/' + params.attributeIds[1] + '/read')
                .header('Accept', 'application/json')
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/attributes/:ieeeAddress/:endpointId/:clusterId/:attributeId/write'.cyan);
            unirest.post(params.host + '/api/attributes/' + params.ieeeAddress + '/' + params.endpointId + '/' + params.clusterIds[1] + '/' + params.attributeIds[1] + '/write')
                .header('Accept', 'application/json')
                .type('json')
                .send({value: false})
                .end(function (response) {
                    printRes(response);
                    next();
                });
        }
    },
    function(next) {
        return function() {
            console.log('/clusters/:ieeeAddress/:endpointId/:clusterId/commands Off'.cyan);
            unirest.post(params.host + '/api/clusters/' + params.ieeeAddress + '/' + params.endpointId + '/' + params.clusterIds[1] + '/commands')
                .header('Accept', 'application/json')
                .type('json')
                .send({command:"Off",params:{}})
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