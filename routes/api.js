'use strict';

var express = require('express');
var zgw = require('zigbee-gw-client');

var router = express.Router();

function deviceToJson(device) {
    var res = {
        ieeeAddress:    device.ieeeAddress.toString(),
        shortAddress:   device.shortAddress,
        manufacturerId: device.manufacturerId,
        deviceStatus:   device.deviceStatus,
        endpoints: []
    };
    for(var i = 0; i < device.endpoints.length; i++) {
        res.endpoints.push(endpointToJson(device.endpoints[i]))
    }
    return res;
}

function endpointToJson(endpoint) {
    var res = {
        endpointId: endpoint.endpointId,
        profileId:  endpoint.profileId,
        deviceId:   endpoint.deviceId,
        deviceVer:  endpoint.deviceVer,
        clusters: []
    };
    for (var key in endpoint.clusters) {
        if (endpoint.clusters.hasOwnProperty(key) && !isNaN(parseInt(key))) {
            var cluster = endpoint.clusters[key];
            res.clusters.push(clusterToJson(cluster));
        }
    }
    return res;
}

function clusterToJson(cluster) {
    var res = {
        clusterId: cluster.clusterId,
        name:      cluster.name,
        attributes: []
    };
    for (var key in cluster.attributes) {
        if (cluster.attributes.hasOwnProperty(key) && !isNaN(parseInt(key))) {
            var attribute = cluster.attributes[key];
            res.attributes.push(attributeToJson(attribute));
        }
    }
    return res;
}

function attributeToJson(attribute) {
    var res = {
        attributeId: attribute.attributeId,
        name:        attribute.name,
        value:       attribute.value
    };
    return res;
}

router.route('/')
    .get(function(req, res) {
        res.redirect('/api/pan');
    });

router.route('/pan')
    .get(function(req, res) {
        res.json({
            nwk_channel: zgw.pan.network.nwk_channel,
            pan_id: zgw.pan.network.pan_id,
            ext_pan_id: zgw.pan.network.ext_pan_id,
            state: zgw.pan.network.state.value
        });
    });

router.route('/devices')
    .get(function(req, res) {
        var devices = [];
        for(var i = 0; i < zgw.pan.devices.length; i++) {
            var device = zgw.pan.devices[i];
            devices.push(deviceToJson(device));
        }
        res.json(devices);
    });

router.route('/devices/:ieeeAddress')
    .get(function(req, res, next) {
        var device = zgw.pan.getDevice(req.params.ieeeAddress);
        if (device) {
            res.json(deviceToJson(device));
        } else {
            var err = new Error('Device not found');
            next(err);
        }
    });

router.route('/endpoints/:ieeeAddress/:endpointId')
    .get(function(req, res, next) {
        var endpoint = zgw.pan.getEndpoint(req.params.ieeeAddress, req.params.endpointId);
        if (endpoint) {
            res.json(endpointToJson(endpoint));
        } else {
            var err = new Error('Endpoint not found');
            next(err);
        }
    });

router.route('/clusters/:ieeeAddress/:endpointId/:clusterId')
    .get(function(req, res, next) {
        var cluster = zgw.pan.getCluster(req.params.ieeeAddress, req.params.endpointId, req.params.clusterId);
        if (cluster) {
            res.json(clusterToJson(cluster));
        } else {
            var err = new Error('Cluster not found');
            next(err);
        }
    });

router.route('/attributes/:ieeeAddress/:endpointId/:clusterId')
    .get(function(req, res, next) {
        var cluster = zgw.pan.getCluster(req.params.ieeeAddress, req.params.endpointId, req.params.clusterId);
        if (cluster) {
            var attributes = [];
            for (var key in cluster.attributes) {
                if (cluster.attributes.hasOwnProperty(key) && !isNaN(parseInt(key))) {
                    attributes.push(attributeToJson(cluster.attributes[key]));
                }
            }
            res.json(attributes);
        } else {
            var err = new Error('Cluster not found');
            next(err);
        }
    });

router.route('/attributes/:ieeeAddress/:endpointId/:clusterId/:attributeId')
    .get(function(req, res, next) {
        var attribute = zgw.pan.getAttribute(req.params.ieeeAddress, req.params.endpointId, req.params.clusterId, req.params.attributeId);
        if (attribute) {
            res.json(attributeToJson(attribute));
        } else {
            var err = new Error('Attribute not found');
            next(err);
        }
    });

//if (app.get('env') != 'development') {
    router.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    router.use(function (err, req, res) {
        res.status(err.status || 500);
        res.json({message: err.message});
    });
//}

module.exports = router;
