"use strict";

const CONFIG = require('../domain/web3deploy.prepare').CONFIG;
const Web3 = require("web3");
const http = require("https");
const listenerController = require("../controllers/listener_controller");
const util = require('../models/util')
var rpcWeb3 = new Web3(new Web3.providers.HttpProvider(CONFIG.ethereum.rpc));
var gasPrice = util.gasPrice;
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
              data: 
              '0x6060604052662386f26fc100006005556000600a60006101000a81548160ff0219169083151502179055506000600a60016101000a81548160ff0219169083151502179055506000600a60026101000a81548160ff021916908315150217905550341561006b57600080fd5b60405160a080611c7c83398101604052808051906020019091908051906020019091908051906020019091908051906020019091908051906020019091905050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555084600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550670de0b6b3a76400008402600281905550603c830242016004819055508160068190555080600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505050611ad7806101a56000396000f300606060405260043610610149576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631e85b7a5146102d457806329dcb0cf146102e95780632e135c54146103125780633686ca3e1461034b57806338af3eed1461036057806341c0e1b5146103b5578063648baf50146103ca5780636e66f6e9146103f757806370a082311461044c5780637a3a0e84146104995780637b3e5e7b146104c25780638da5cb5b146104eb5780639b2cb5d8146105405780639bfd986e146105695780639f1bf666146105ab578063a035b1fe146105d0578063a34328bf146105f9578063ccb07cef14610632578063d424f6281461065f578063d83edd701461068c578063d87ee2ef146106c5578063e169185a14610707578063e69b5a6a14610758578063f2fde38b14610791578063f65ad55c146107ca575b6000600a60019054906101000a900460ff1615151561016757600080fd5b6004544210151561017757600080fd5b600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615156101cf57600080fd5b34905060055481101580156101ea5750600254816003540111155b15156101f557600080fd5b80600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550806003600082825401925050819055507f8098cf0563cf36c7339b1b31f144712a27ea613dd22e39438cf1a1e5d3e1a2e66002546003543384604051808581526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200194505050505060405180910390a150005b34156102df57600080fd5b6102e7610803565b005b34156102f457600080fd5b6102fc6109f2565b6040518082815260200191505060405180910390f35b341561031d57600080fd5b610349600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506109f8565b005b341561035657600080fd5b61035e610aae565b005b341561036b57600080fd5b610373610c60565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156103c057600080fd5b6103c8610c86565b005b34156103d557600080fd5b6103dd610d1b565b604051808215151515815260200191505060405180910390f35b341561040257600080fd5b61040a610d2e565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561045757600080fd5b610483600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610d54565b6040518082815260200191505060405180910390f35b34156104a457600080fd5b6104ac610d6c565b6040518082815260200191505060405180910390f35b34156104cd57600080fd5b6104d5610d72565b6040518082815260200191505060405180910390f35b34156104f657600080fd5b6104fe610d78565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561054b57600080fd5b610553610d9d565b6040518082815260200191505060405180910390f35b341561057457600080fd5b6105a9600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610da3565b005b34156105b657600080fd5b6105ce60048080351515906020019091905050610f63565b005b34156105db57600080fd5b6105e36110dd565b6040518082815260200191505060405180910390f35b341561060457600080fd5b610630600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506110e3565b005b341561063d57600080fd5b610645611251565b604051808215151515815260200191505060405180910390f35b341561066a57600080fd5b610672611264565b604051808215151515815260200191505060405180910390f35b341561069757600080fd5b6106c3600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611277565b005b34156106d057600080fd5b610705600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050611467565b005b341561071257600080fd5b61073e600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506115da565b604051808215151515815260200191505060405180910390f35b341561076357600080fd5b61078f600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506115fa565b005b341561079c57600080fd5b6107c8600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611957565b005b34156107d557600080fd5b610801600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506119f5565b005b6000600454421015156109ea57600a60029054906101000a900460ff1680156108395750600a60009054906101000a900460ff16155b151561084457600080fd5b6000600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205411151561089257600080fd5b600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050156109e0576000600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550806003600082825403925050819055507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf633826000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a16109e5565b600080fd5b6109ef565b600080fd5b50565b60045481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610a5357600080fd5b6000600960008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b60045442101515610c5957600a60029054906101000a900460ff161515610ad457600080fd5b600a60009054906101000a900460ff168015610b3d57503373ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16145b1515610b4857600080fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6003549081150290604051600060405180830381858888f1935050505015610c4f577fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf6600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166003546000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a16000600381905550610c54565b600080fd5b610c5e565b600080fd5b565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610ce157600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b600a60029054906101000a900460ff1681565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60086020528060005260406000206000915090505481565b60025481565b60035481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60055481565b60045442101515610f5a576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610e0957600080fd5b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb83836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b1515610ecd57600080fd5b5af11515610eda57600080fd5b5050507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf682826001604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a1610f5f565b600080fd5b5050565b600454421015156110d5576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610fc957600080fd5b801561107e576001600a60006101000a81548160ff0219169083151502179055507fec3f991caf7857d61663fd1bba1739e04abd4781238508cde554bb849d790c85600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600354604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a161109a565b6000600a60006101000a81548160ff0219169083151502179055505b6001600a60016101000a81548160ff0219169083151502179055506001600a60026101000a81548160ff0219169083151502179055506110da565b600080fd5b50565b60065481565b60045442101515611249576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561114957600080fd5b600a60029054906101000a900460ff1680156111715750600a60009054906101000a900460ff165b151561117c57600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166108fc6003549081150290604051600060405180830381858888f193505050501561123f577fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf6816003546000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a16000600381905550611244565b600080fd5b61124e565b600080fd5b50565b600a60019054906101000a900460ff1681565b600a60009054906101000a900460ff1681565b60006004544210151561145e57600a60029054906101000a900460ff1680156112ad5750600a60009054906101000a900460ff16155b15156112b857600080fd5b6000600860008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205411151561130657600080fd5b600860008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015611454576000600860008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550806003600082825403925050819055507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf682826000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a1611459565b600080fd5b611463565b600080fd5b5050565b600454421015156115d1576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156114cd57600080fd5b600a60029054906101000a900460ff1680156114f55750600a60009054906101000a900460ff165b151561150057600080fd5b8173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050156115c7577fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf682826000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a1806003600082825403925050819055506115cc565b600080fd5b6115d6565b600080fd5b5050565b60096020528060005260406000206000915054906101000a900460ff1681565b6000806004544210151561194d57600a60029054906101000a900460ff1680156116305750600a60009054906101000a900460ff165b151561163b57600080fd5b6006548202600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231836040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b15156116fc57600080fd5b5af1151561170957600080fd5b505050604051805190501015151561172057600080fd5b6000600860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205411151561176e57600080fd5b600860008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205491503090506000600860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8460065485026040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b15156118c057600080fd5b5af115156118cd57600080fd5b5050507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf683836001604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a1611952565b600080fd5b505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156119b257600080fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515611a5057600080fd5b6001600960008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550505600a165627a7a72305820a3065ec40a3bbc549cf660f4a55e126cf691f8b92d43beec3657d88cb611adc20029',  
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
