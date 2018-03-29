"use strict";

const CONFIG = require('../domain/web3deploy.prepare').CONFIG;
const Web3 = require("web3");
const util = require('../models/util');
var rpcWeb3 = new Web3(new Web3.providers.HttpProvider(CONFIG.ethereum.rpc));

var  WhiteAddressModel = module.exports;

WhiteAddressModel.addWhiteAddress  = function addWhiteAddress(body){
    return new Promise((resolve,reject)=>{
      if(!body.contract || !body.addAddress){
        resolve({
          isSuccess:false,
          message:" 缺少参数"
        });
      }
      let contract = body.contract;
      let addAddress = body.addAddress;
      var MyContract = rpcWeb3.eth.contract(util.abi);
      var myContractInstance = MyContract.at(contract);

      let locked = rpcWeb3.personal.unlockAccount(rpcWeb3.eth.accounts[0],"123456789");
      if(locked){
          myContractInstance.addWhiteAddress(addAddress,{from: rpcWeb3.eth.accounts[0]},function(err, result){
            if(err){
              resolve({
                isSuccess:false,
                message:"打包失败"
              });
            }
            console.log("白名单-打包中",result);
            resolve({
              isSuccess:true,
              transactionHash:result,
              message:"打包中"
            });
          });
        }else{
          resolve({
            isSuccess:false,
            message:"解锁失败"
          });
        }
    });
};

WhiteAddressModel.verifyAddress  = function verifyAddress(body){  
  return new Promise((resolve,reject)=>{
    if(body.addressArray && body.contract){
      let contract = body.contract;
      var MyContract = rpcWeb3.eth.contract(util.abi);
      var myContractInstance = MyContract.at(contract);
      let backaArray = body.addressArray.map(address=>{
          let isIn = myContractInstance.whiteAddressesOf(address);
          return{
            address:address,
            isIn:isIn
          }
      });
      return Promise.all(backaArray).then(backaArray=>{
        console.log("白名单-查询成功  共",backaArray.length,"条");
        resolve({
          isSuccess:true,
          addressArray:backaArray,
          message:"查询成功"
        });
      });
    }else{
      resolve({
        isSuccess:false,
        addressArray:[],
        message:"参数错误"
      });
    }
  });
};
