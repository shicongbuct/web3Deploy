"use strict";

const web3deployModel = require("../models/web3deploy.model");
var ControllerWeb3deploy = module.exports;

ControllerWeb3deploy.web3deploy = function web3deploy(req, res) {
    let tsc = req.body;
    web3deployModel.web3deploy(tsc).then((data) => {
        res.status(200);
        res.json(data);
    }).catch((error) => {
        console.error(error);
        res.status(500);
        res.json(error);
    });
};

module.exports.ControllerWeb3deploy = ControllerWeb3deploy;