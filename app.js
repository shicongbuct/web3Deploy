"use strict";

const express = require("express"),
    bodyParser = require("body-parser");
const ControllerWeb3deploy = require("./api/controllers/web3deploy_controller");
const ControllerListener = require("./api/controllers/listener_controller");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/nodes/token/contract/deploy', ControllerWeb3deploy.web3deploy);//导入 keystory

var port = process.env.PORT || 10013;
app.listen(port);
console.log(`listen the port: ${port}`);
ControllerListener.startListener();
module.exports = app;
