"use strict";

const express = require("express"),
    bodyParser = require("body-parser");
const ControllerWeb3deploy = require("./api/controllers/web3deploy_controller");
const ControllerListener = require("./api/controllers/listener_controller");
const ControllerWhiteAddress = require("./api/controllers/whiteaddress_controller");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/hkico/nodes/token/contract/deploy', ControllerWeb3deploy.web3deploy);//部署合约
app.post('/hkico/nodes/token/contract/addlistener', ControllerListener.addListener);//添加监听
app.post('/hkico/nodes/token/contract/addwhite/address', ControllerWhiteAddress.addWhiteAddress);//添加白名单
app.post('/hkico/nodes/token/contract/whiteaddress/verify', ControllerWhiteAddress.verifyAddress);//添加白名单
var port = process.env.PORT || 8108;
app.listen(port);
console.log(`listen the port: ${port}`);
ControllerListener.startListener();
module.exports = app;
