"use strict";

const CONFIG = require('../domain/web3deploy.prepare').CONFIG;
const Web3 = require("web3");
const http = require("http");
const listenerController = require("../controllers/listener_controller");
const util = require('../models/util')
var rpcWeb3 = new Web3(new Web3.providers.HttpProvider(CONFIG.ethereum.rpc));

var  Web3deployModel = module.exports;

Web3deployModel.web3deploy  = function web3deploy(body){
    return new Promise((resolve,reject)=>{
        if(!body.ifSuccessfulSendTo || !body.fundingGoalInEthers || 
              !body.durationInMinutes || !body.finneyCostOfEachToken || !body.addressOfTokenUsedAsReward){
                resolve({
                  isSuccess:false,
                  message:"参数不对"
                });
        }
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
              data: 
              '0x6060604052662386f26fc100006005556000600960006101000a81548160ff0219169083151502179055506000600960016101000a81548160ff0219169083151502179055506000600960026101000a81548160ff021916908315150217905550341561006b57600080fd5b60405160a0806119b483398101604052808051906020019091908051906020019091908051906020019091908051906020019091908051906020019091905050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555084600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550670de0b6b3a76400008402600281905550603c830242016004819055508160068190555080600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505050505061180f806101a56000396000f300606060405260043610610128576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631e85b7a51461025b57806329dcb0cf146102705780633686ca3e1461029957806338af3eed146102ae57806341c0e1b514610303578063648baf50146103185780636e66f6e91461034557806370a082311461039a5780637a3a0e84146103e75780637b3e5e7b146104105780638da5cb5b146104395780639b2cb5d81461048e5780639bfd986e146104b75780639f1bf666146104f9578063a035b1fe1461051e578063a34328bf14610547578063ccb07cef14610580578063d424f628146105ad578063d83edd70146105da578063d87ee2ef14610613578063e69b5a6a14610655578063f2fde38b1461068e575b6000600960019054906101000a900460ff1615151561014657600080fd5b6004544210151561015657600080fd5b34905060055481101580156101715750600254816003540111155b151561017c57600080fd5b80600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550806003600082825401925050819055507f8098cf0563cf36c7339b1b31f144712a27ea613dd22e39438cf1a1e5d3e1a2e66002546003543384604051808581526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200194505050505060405180910390a150005b341561026657600080fd5b61026e6106c7565b005b341561027b57600080fd5b6102836108b6565b6040518082815260200191505060405180910390f35b34156102a457600080fd5b6102ac6108bc565b005b34156102b957600080fd5b6102c1610a6e565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561030e57600080fd5b610316610a94565b005b341561032357600080fd5b61032b610b29565b604051808215151515815260200191505060405180910390f35b341561035057600080fd5b610358610b3c565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156103a557600080fd5b6103d1600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610b62565b6040518082815260200191505060405180910390f35b34156103f257600080fd5b6103fa610b7a565b6040518082815260200191505060405180910390f35b341561041b57600080fd5b610423610b80565b6040518082815260200191505060405180910390f35b341561044457600080fd5b61044c610b86565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561049957600080fd5b6104a1610bab565b6040518082815260200191505060405180910390f35b34156104c257600080fd5b6104f7600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610bb1565b005b341561050457600080fd5b61051c60048080351515906020019091905050610d71565b005b341561052957600080fd5b610531610eeb565b6040518082815260200191505060405180910390f35b341561055257600080fd5b61057e600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610ef1565b005b341561058b57600080fd5b61059361105f565b604051808215151515815260200191505060405180910390f35b34156105b857600080fd5b6105c0611072565b604051808215151515815260200191505060405180910390f35b34156105e557600080fd5b610611600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611085565b005b341561061e57600080fd5b610653600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050611275565b005b341561066057600080fd5b61068c600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506113e8565b005b341561069957600080fd5b6106c5600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611745565b005b6000600454421015156108ae57600960029054906101000a900460ff1680156106fd5750600960009054906101000a900460ff16155b151561070857600080fd5b6000600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205411151561075657600080fd5b600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050156108a4576000600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550806003600082825403925050819055507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf633826000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a16108a9565b600080fd5b6108b3565b600080fd5b50565b60045481565b60045442101515610a6757600960029054906101000a900460ff1615156108e257600080fd5b600960009054906101000a900460ff16801561094b57503373ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16145b151561095657600080fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6003549081150290604051600060405180830381858888f1935050505015610a5d577fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf6600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166003546000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a16000600381905550610a62565b600080fd5b610a6c565b600080fd5b565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610aef57600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b600960029054906101000a900460ff1681565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60086020528060005260406000206000915090505481565b60025481565b60035481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60055481565b60045442101515610d68576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610c1757600080fd5b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb83836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b1515610cdb57600080fd5b5af11515610ce857600080fd5b5050507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf682826001604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a1610d6d565b600080fd5b5050565b60045442101515610ee3576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610dd757600080fd5b8015610e8c576001600960006101000a81548160ff0219169083151502179055507fec3f991caf7857d61663fd1bba1739e04abd4781238508cde554bb849d790c85600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600354604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a1610ea8565b6000600960006101000a81548160ff0219169083151502179055505b6001600960016101000a81548160ff0219169083151502179055506001600960026101000a81548160ff021916908315150217905550610ee8565b600080fd5b50565b60065481565b60045442101515611057576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610f5757600080fd5b600960029054906101000a900460ff168015610f7f5750600960009054906101000a900460ff165b1515610f8a57600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166108fc6003549081150290604051600060405180830381858888f193505050501561104d577fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf6816003546000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a16000600381905550611052565b600080fd5b61105c565b600080fd5b50565b600960019054906101000a900460ff1681565b600960009054906101000a900460ff1681565b60006004544210151561126c57600960029054906101000a900460ff1680156110bb5750600960009054906101000a900460ff16155b15156110c657600080fd5b6000600860008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205411151561111457600080fd5b600860008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015611262576000600860008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550806003600082825403925050819055507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf682826000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a1611267565b600080fd5b611271565b600080fd5b5050565b600454421015156113df576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156112db57600080fd5b600960029054906101000a900460ff1680156113035750600960009054906101000a900460ff165b151561130e57600080fd5b8173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050156113d5577fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf682826000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a1806003600082825403925050819055506113da565b600080fd5b6113e4565b600080fd5b5050565b6000806004544210151561173b57600960029054906101000a900460ff16801561141e5750600960009054906101000a900460ff165b151561142957600080fd5b6006548202600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231836040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b15156114ea57600080fd5b5af115156114f757600080fd5b505050604051805190501015151561150e57600080fd5b6000600860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205411151561155c57600080fd5b600860008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205491503090506000600860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8460065485026040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b15156116ae57600080fd5b5af115156116bb57600080fd5b5050507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf683836001604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a1611740565b600080fd5b505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156117a057600080fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505600a165627a7a72305820bdee866cfcdfde8506c8f2bc298f9c74c5f85a8ad2554d4d4733b2a87ada8f490029', 
              gas: '4700000'
            }, function (e, contract){
              if(e){
                resolve({
                  isSuccess:false,
                  message:e
                });
              }
              console.log("合约生成中 address:"+contract.address);
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
                          projectId:body.projectId
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
