"use strict";

const Web3 = require("web3");
var rpcWeb3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

let from = '0xf17f52151EbEF6C7334FAD080c5704D77216b732';
let to = '0x345ca3e014aaf5dca488057592ee47305d9b3e10';

let data =  {from: from, to: to, value: rpcWeb3.toWei(6, "ether")};
rpcWeb3.eth.sendTransaction(data, function(err, transactionHash) {
    if (!err){
        console.log('---'+transactionHash+'-----');
    }else{
        console.log("nsufficient funds for gas");
    }
});