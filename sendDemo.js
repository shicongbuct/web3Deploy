"use strict";

const Web3 = require("web3");
var rpcWeb3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

let from = '0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef';
let to = '0x8cdaf0cd259887258bc13a92c0a6da92698644c0';

let data =  {from: from, to: to, value: rpcWeb3.toWei(6, "ether")};
rpcWeb3.eth.sendTransaction(data, function(err, transactionHash) {
    if (!err){
        console.log('---'+transactionHash+'-----');
    }else{
        console.log("nsufficient funds for gas");
    }
});