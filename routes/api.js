'use strict';

var when = require('when');

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
        res.json({
            version: "1.0"
        });
    });

router.route('/test')
    .get(function(req, res) {
        var obj = { z: 3 };
        obj["name"] = 1;
        obj[0] = 2;
        res.json(obj)
    });

router.param('ieeeAddress', function (req, res, next, ieeeAddress) {
    var device = zgw.pan.getDevice(ieeeAddress);
    if (device) {
        req.device = device;
        next();
    } else {
        var err = new Error('Device not found');
        next(err);
    }
});

router.param('endpointId', function (req, res, next, endpointId) {
    var err;
    if (req.device) {
        var endpoint;
        for (var i = 0; i < req.device.endpoints.length; i++) {
            if (req.device.endpoints[i].endpointId == endpointId) {
                endpoint = req.device.endpoints[i];
                break
            }
        }
        if (endpoint) {
            req.endpoint = endpoint;
            next();
        } else {
            err = new Error('Endpoint not found');
            next(err);
        }
    } else {
        err = new Error('Device not found');
        next(err);
    }
});

router.param('clusterId', function (req, res, next, clusterId) {
    var err;
    if (req.endpoint) {
        var cluster = req.endpoint.clusters[clusterId];
        if (cluster) {
            req.cluster = cluster;
            next();
        } else {
            err = new Error('Cluster not found');
            next(err);
        }
    } else {
        err = new Error('Endpoint not found');
        next(err);
    }
});

router.param('attributeId', function (req, res, next, attributeId) {
    var err;
    if (req.cluster) {
        var attribute = req.cluster.attributes[attributeId];
        if (attribute) {
            req.attribute = attribute;
            next();
        } else {
            err = new Error('Attribute not found');
            next(err);
        }
    } else {
        err = new Error('Cluster not found');
        next(err);
    }
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
        if (req.device) {
            res.json(deviceToJson(req.device));
        } else {
            var err = new Error('Device not found');
            next(err);
        }
    });

router.route('/endpoints/:ieeeAddress')
    .get(function(req, res, next) {
        if (req.device) {
            var endpoints = [];
            for (var i = 0; i < req.device.endpoints.length; i++) {
                endpoints.push(endpointToJson(req.device.endpoints[i]));
            }
            res.json(endpoints);
        } else {
            var err = new Error('Device not found');
            next(err);
        }
    });

router.route('/endpoints/:ieeeAddress/:endpointId')
    .get(function(req, res, next) {
        if (req.endpoint) {
            res.json(endpointToJson(req.endpoint));
        } else {
            var err = new Error('Endpoint not found');
            next(err);
        }
    });

router.route('/clusters/:ieeeAddress/:endpointId')
    .get(function(req, res, next) {
        if (req.endpoint) {
            var clusters = [];
            for (var key in req.endpoint.clusters) {
                if (req.endpoint.clusters.hasOwnProperty(key) && !isNaN(parseInt(key))) {
                    clusters.push(clusterToJson(req.endpoint.clusters[key]));
                }
            }
            res.json(clusters);
        } else {
            var err = new Error('Endpoint not found');
            next(err);
        }
    });

router.route('/clusters/:ieeeAddress/:endpointId/:clusterId')
    .get(function(req, res, next) {
        if (req.cluster) {
            res.json(clusterToJson(req.cluster));
        } else {
            var err = new Error('Cluster not found');
            next(err);
        }
    });

router.route('/attributes/:ieeeAddress/:endpointId/:clusterId')
    .get(function(req, res, next) {
        if (req.cluster) {
            var attributes = [];
            for (var key in req.cluster.attributes) {
                if (req.cluster.attributes.hasOwnProperty(key) && !isNaN(parseInt(key))) {
                    attributes.push(attributeToJson(req.cluster.attributes[key]));
                }
            }
            res.json(attributes);
        } else {
            var err = new Error('Cluster not found');
            next(err);
        }
    });

var routerAttr = express.Router({mergeParams:true});
router.use('/attributes/:ieeeAddress/:endpointId/:clusterId/:attributeId', routerAttr);

routerAttr.route('/')
    .get(function(req, res, next) {
        if (req.attribute) {
            res.json(attributeToJson(req.attribute));
        } else {
            var err = new Error('Attribute not found');
            next(err);
        }
    });

routerAttr.route('/read')
    .get(function(req, res, next) {
        if (req.attribute) {
            when(req.attribute.read())
                .then(function(val) {
                    res.json({result: "success", value: val});
                })
                .catch(function(err) {
                    res.json({result: "failed", err: err})
                });
        } else {
            var err = new Error('Attribute not found');
            next(err);
        }
    });

routerAttr.route('/write')
    .post(function(req, res, next) {
        var err;
        if (req.attribute) {
            if (typeof req.body.value != "undefined") {
                when(req.attribute.write(req.body.value))
                    .then(function (val) {
                        res.json({result: "success", value: val});
                    })
                    .catch(function (err) {
                        res.json({result: "failed", err: err})
                    });
            } else {
                err = new Error('Value not found');
                err.status = 400;
                next(err);
            }
        } else {
            err = new Error('Attribute not found');
            next(err);
        }
    });

//if (app.get('env') != 'development') {
    router.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    router.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({message: err.message});
    });
//}

module.exports = router;
