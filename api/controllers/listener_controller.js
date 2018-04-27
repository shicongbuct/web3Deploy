const Web3 = require("web3");
const util = require('../models/util');
const rf = require("fs");
const http = require("https");
const CONFIG = require('../domain/web3deploy.prepare').CONFIG;
var rpcWeb3 = new Web3(new Web3.providers.HttpProvider(CONFIG.ethereum.rpc));

var ControllerListener = module.exports;

ControllerListener.startListener = function startListener() {
    console.log('----------------listener------------------');
    var MyContract = rpcWeb3.eth.contract(util.abi);
    var contracts = JSON.parse(rf.readFileSync("contracts.json","utf-8"));
    contracts.forEach((contract)=>{
        var myContractInstance = MyContract.at(contract);
        var someone = myContractInstance.transferEvent();
        someone.watch(function(error, transactiondate){
            if(error){
                console.error(error);
                return;
            }
            // { logIndex: 0,
            //     transactionIndex: 0,
            //     transactionHash: '0x22c9927e2226505ce955569825feb1fc33a6b04771eceebf6b7575cd781371a6',
            //     blockHash: '0x0f6d415a3167dbff131a842a4e4f9132ca0863c8263ce07076973a5fd9651270',
            //     blockNumber: 6,
            //     address: '0xf25186b5081ff5ce73482ad761db0eb0d25abfbf',
            //     type: 'mined',
            //     event: 'transferEvent',
            //     args: 
            //      { fundingGoal: BigNumber { s: 1, e: 20, c: [Array] },
            //        amountRaised: BigNumber { s: 1, e: 19, c: [Array] },
            //        fromAddress: '0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef',
            //        amount: BigNumber { s: 1, e: 18, c: [Array] } } }
            if(transactiondate.args){
                console.log(transactiondate.args);
                return new Promise((resolve, reject) => {
                    var parm = transactiondate.args;
                    parm.contract = contract;
                    parm.transactionHash = transactiondate.transactionHash;
                    let write = parm;
                    let option = Object.assign({}, CONFIG.Api.uploadProgress);
                    option.headers= {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(JSON.stringify(write))
                    };
                    var req = http.request(option, (res) =>{
                            var data = "";
                            res.setEncoding("utf8");
                            res.on("data", (chunk) => {
                                data += chunk;
                            });
                            res.on("end", () => {
                                resolve(data);
                            });
                    });
                    req.on('error', (e) => {
                        resolve("上传失败:"+JSON.stringify(write));
                    });
                    req.write(JSON.stringify(write));
                    req.end();
                }).then((data)=>{
                    console.log(data);
                });
            }
        });
    });
}

//  手动 添加 监听
ControllerListener.addListener = function addListener(req,res) {
        let contract = req.body.contract;
        let projectId = req.body.projectId;
        let password = req.body.password;
        if(!password  ||  !contract || !projectId || password != 'OABD#*1K-'){
            res.status(401);
            res.json({
                message:"缺少参数/密码错误"
            });
            return;
        }
        ControllerListener.addContractListener(contract).then(data=>{
            return new Promise((resolve, reject) => {
                var parm = {
                    contract:contract,
                    projectId:projectId
                };
                let write = parm;
                let option = Object.assign({}, CONFIG.Api.uploadToBitop);
                option.headers= {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(JSON.stringify(write))
                };
                var req = http.request(option, (res) =>{
                        var data = "";
                        res.setEncoding("utf8");
                        res.on("data", (chunk) => {
                            data += chunk;
                        });
                        res.on("end", () => {
                            resolve(data);
                        });
                });
                req.on('error', (e) => {
                    resolve("上传失败:"+JSON.stringify(write));
                });
                req.write(JSON.stringify(write));
                req.end();
            }).catch(error=>{
                res.status(500);
                res.json({
                    message:"提交至bitop出现错误"
                });
            }).then((data)=>{
                res.status(200);
                res.json(data);
            });
        }).catch(error=>{
            res.status(500);
            res.json({
                message:"添加合约出现错误"
            });
        });;
};

ControllerListener.addContractListener  = function addContractListener(contract){
    return new Promise((resolve, reject) => {
        var contracts = JSON.parse(rf.readFileSync("contracts.json","utf-8"));
        contracts.push(contract);
        rf.writeFileSync("contracts.json",JSON.stringify(contracts));
        var MyContract = rpcWeb3.eth.contract(util.abi);
        var myContractInstance = MyContract.at(contract);
        var someone = myContractInstance.transferEvent();
        someone.watch(function(error, transactiondate){
            if(error){
                resolve({
                    isSuccess:false,
                    contract:contract,
                    message:error
                });
                console.error(error);
                return;
            }
            // { logIndex: 0,
            //     transactionIndex: 0,
            //     transactionHash: '0x22c9927e2226505ce955569825feb1fc33a6b04771eceebf6b7575cd781371a6',
            //     blockHash: '0x0f6d415a3167dbff131a842a4e4f9132ca0863c8263ce07076973a5fd9651270',
            //     blockNumber: 6,
            //     address: '0xf25186b5081ff5ce73482ad761db0eb0d25abfbf',
            //     type: 'mined',
            //     event: 'transferEvent',
            //     args: 
            //      { fundingGoal: BigNumber { s: 1, e: 20, c: [Array] },
            //        amountRaised: BigNumber { s: 1, e: 19, c: [Array] },
            //        fromAddress: '0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef',
            //        amount: BigNumber { s: 1, e: 18, c: [Array] } } }
            if(transactiondate.args){
                // console.log(transactiondate.args);
                return new Promise((resolve, reject) => {
                    var parm = transactiondate.args;
                    parm.contract = contract;
                    let write = parm;
                    let option = Object.assign({}, CONFIG.Api.uploadProgress);
                    option.headers= {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(JSON.stringify(write))
                    };
                    var req = http.request(option, (res) =>{
                            var data = "";
                            res.setEncoding("utf8");
                            res.on("data", (chunk) => {
                                data += chunk;
                            });
                            res.on("end", () => {
                                resolve(data);
                            });
                    });
                    req.on('error', (e) => {
                        resolve("上传失败:"+JSON.stringify(write));
                    });
                    req.write(JSON.stringify(write));
                    req.end();
                }).then((data)=>{
                    console.log(data);
                });
            }
        });
        resolve({
            isSuccess:true,
            message:'添加成功'
        });
    });
}