"use strict";

const CONFIG = require('../domain/web3deploy.prepare').CONFIG;
const Web3 = require("web3");
const http = require("https");
const listenerController = require("../controllers/listener_controller");
const util = require('../models/util')
var rpcWeb3 = new Web3(new Web3.providers.HttpProvider(CONFIG.ethereum.rpc));
var gasPrice = util.deployGasPrice;
var  Web3deployModel = module.exports;

Web3deployModel.web3deploy  = function web3deploy(body){
    return new Promise((resolve,reject)=>{
        if(!body.ifSuccessfulSendTo || !body.fundingGoalInEthers || 
              !body.durationInMinutes || !body.finneyCostOfEachToken || !body.addressOfTokenUsedAsReward || !body.projectId){
                resolve({
                  isSuccess:false,
                  message:"参数不对"
                });
        }
        var projectId = body.projectId;
        var ifSuccessfulSendTo = body.ifSuccessfulSendTo/* var of type address here */ ;
        var fundingGoalInEthers = body.fundingGoalInEthers/* var of type uint256 here */ ;
        var durationInMinutes = body.durationInMinutes/* var of type uint256 here */ ;
        var finneyCostOfEachToken = body.finneyCostOfEachToken/* var of type uint256 here */ ;
        var addressOfTokenUsedAsReward = body.addressOfTokenUsedAsReward/* var of type address here */ ;
        let locked = rpcWeb3.personal.unlockAccount(rpcWeb3.eth.accounts[0],"123456789");
        if(locked){
          var crowdsaleContract = rpcWeb3.eth.contract(util.abi);
          var crowdsale = crowdsaleContract.new(
                ifSuccessfulSendTo,
                fundingGoalInEthers,
                durationInMinutes,
                finneyCostOfEachToken,
                addressOfTokenUsedAsReward,
            {
              from: rpcWeb3.eth.accounts[0], 
              data: util.data,  
              gas: '4700000',
              gasPrice:'0x' + gasPrice.toString(16)
            }, function (e, contract){
              if(e){
                resolve({
                  isSuccess:false,
                  message:e
                });
                return;
              }
              console.log("合约生成中 address:" + contract.address);
              console.log("transactionHash:"+contract.transactionHash);
              if (contract.address && typeof contract.address !== 'undefined') {
                  console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);

                  return listenerController.addContractListener(contract.address).then(data=>{
                      if(data.isSuccess){
                        console.log(contract.address+"自动监听");
                        let data = {
                          isSuccess:true,
                          ifSuccessfulSendTo:ifSuccessfulSendTo,
                          fundingGoalInEthers:fundingGoalInEthers,
                          durationInMinutes:durationInMinutes,
                          finneyCostOfEachToken:finneyCostOfEachToken,
                          addressOfTokenUsedAsReward:addressOfTokenUsedAsReward,
                          contract:contract.address,
                          projectId:projectId
                        };
                        return sendToServer(data);
                      }else{
                        console.error(contract.address+"未能自动监听error");
                        resolve({
                          isSuccess:false,
                          message:contract.address+"未能自动监听error"
                        });
                      }
                  });
              }else{
                resolve({
                  isSuccess:false,
                  hash:contract.transactionHash,
                  message:"合约生成中"
                });
              }
            })
        }else{
          resolve({
            isSuccess:false,
            message:"合约生成失败"
          });
        }
    });
};

function sendToServer(parm){
    return new Promise((resolve, reject) => {
      let write = parm;
      let option = Object.assign({}, CONFIG.Api.createProject);
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
                console.log("上传创建项目成功"+JSON.stringify(write));
                  resolve({
                    isSuccess:true,
                    message:data
                  });
              });
      });
      req.on('error', (e) => {
          console.log("上传创建项目失败:"+JSON.stringify(write));
          resolve({
            isSuccess:false,
            message:JSON.stringify(write)
          });
      });
      req.write(JSON.stringify(write));
      req.end();
    }).then((data)=>{
      console.log(data);
    });
};
