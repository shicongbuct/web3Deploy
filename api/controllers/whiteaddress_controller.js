"use strict";

const WhiteAddressModel = require("../models/whiteaddress.model");
var ControllerWhiteAddress= module.exports;

ControllerWhiteAddress.addWhiteAddress = function addWhiteAddress(req, res) {
    WhiteAddressModel.addWhiteAddress(req.body).then((data) => {
        res.status(200);
        res.json(data);
    }).catch((error) => {
        console.error(error);
        res.status(500);
        res.json(error);
    });
};

ControllerWhiteAddress.verifyAddress = function verifyAddress(req, res) {
    WhiteAddressModel.verifyAddress(req.body).then((data) => {
        res.status(200);
        res.json(data);
    }).catch((error) => {
        console.error(error);
        res.status(500);
        res.json(error);
    });
};

module.exports.ControllerWhiteAddress = ControllerWhiteAddress;