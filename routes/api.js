'use strict';

var express = require('express');
var zgw = require('zigbee-gw-client');

var router = express.Router();

function deviceToJson(device) {
    return {
        ieeeAddress: device.ieeeAddress.toString(),
        shortAddress: device.shortAddress
    };
}

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
        if (device)
            res.json(deviceToJson(device));
        else {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        }
    });

module.exports = router;
