"use strict";

const CONFIG = require('../domain/web3deploy.prepare').CONFIG;
const Web3 = require("web3");
const util = require('../models/util')
var rpcWeb3 = new Web3(new Web3.providers.HttpProvider(CONFIG.ethereum.rpc));

var  Web3deployModel = module.exports;

Web3deployModel.web3deploy  = function web3deploy(body){
    return new Promise((resolve,reject)=>{
        if(!body.ifSuccessfulSendTo || !body.fundingGoalInEthers || 
              !body.durationInMinutes || !body.finneyCostOfEachToken || !body.addressOfTokenUsedAsReward){
                resolve({
                  ifSuccess:false,
                  message:"参数不对"
                });
        }
        var ifSuccessfulSendTo = body.ifSuccessfulSendTo/* var of type address here */ ;
        var fundingGoalInEthers = body.fundingGoalInEthers/* var of type uint256 here */ ;
        var durationInMinutes = body.durationInMinutes/* var of type uint256 here */ ;
        var finneyCostOfEachToken = body.finneyCostOfEachToken/* var of type uint256 here */ ;
        var addressOfTokenUsedAsReward = body.addressOfTokenUsedAsReward/* var of type address here */ ;

        var crowdsaleContract = rpcWeb3.eth.contract(util.abi);


        var crowdsale = crowdsaleContract.new(
              ifSuccessfulSendTo,
              fundingGoalInEthers,
              durationInMinutes,
              finneyCostOfEachToken,
              addressOfTokenUsedAsReward,
          {
            from: rpcWeb3.eth.accounts[0], 
            data: '0x606060405266038d7ea4c6800060055560006008556000600a60006101000a81548160ff0219169083151502179055506000600a60016101000a81548160ff0219169083151502179055506000600a60026101000a81548160ff021916908315150217905550341561007057600080fd5b60405160a0806115a983398101604052808051906020019091908051906020019091908051906020019091908051906020019091908051906020019091905050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555084600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550670de0b6b3a76400008402600281905550603c830242016004819055508160068190555080600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050506113ff806101aa6000396000f30060606040526004361061011d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631072cbea1461025057806329dcb0cf146102925780633686ca3e146102bb57806338af3eed146102d057806341c0e1b514610325578063549624131461033a578063648baf50146103635780636e66f6e9146103905780636fd42b32146103e557806370a082311461041e5780637a3a0e841461046b5780637b3e5e7b146104945780637be6786b146104bd578063875081fd146104e25780638da5cb5b1461051b57806397a854a7146105705780639b2cb5d8146105a9578063a035b1fe146105d2578063ccb07cef146105fb578063d424f62814610628578063f2fde38b14610655575b6000600a60019054906101000a900460ff1615151561013b57600080fd5b6004544210151561014b57600080fd5b34905060055481101580156101665750600254816003540111155b151561017157600080fd5b80600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550806003600082825401925050819055507f8098cf0563cf36c7339b1b31f144712a27ea613dd22e39438cf1a1e5d3e1a2e66002546003543384604051808581526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200194505050505060405180910390a150005b341561025b57600080fd5b610290600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190505061068e565b005b341561029d57600080fd5b6102a561084e565b6040518082815260200191505060405180910390f35b34156102c657600080fd5b6102ce610854565b005b34156102db57600080fd5b6102e36109f8565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561033057600080fd5b610338610a1e565b005b341561034557600080fd5b61034d610ab3565b6040518082815260200191505060405180910390f35b341561036e57600080fd5b610376610ab9565b604051808215151515815260200191505060405180910390f35b341561039b57600080fd5b6103a3610acc565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156103f057600080fd5b61041c600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610af2565b005b341561042957600080fd5b610455600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610f01565b6040518082815260200191505060405180910390f35b341561047657600080fd5b61047e610f19565b6040518082815260200191505060405180910390f35b341561049f57600080fd5b6104a7610f1f565b6040518082815260200191505060405180910390f35b34156104c857600080fd5b6104e060048080351515906020019091905050610f25565b005b34156104ed57600080fd5b610519600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061109f565b005b341561052657600080fd5b61052e611202565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561057b57600080fd5b6105a7600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611227565b005b34156105b457600080fd5b6105bc611303565b6040518082815260200191505060405180910390f35b34156105dd57600080fd5b6105e5611309565b6040518082815260200191505060405180910390f35b341561060657600080fd5b61060e61130f565b604051808215151515815260200191505060405180910390f35b341561063357600080fd5b61063b611322565b604051808215151515815260200191505060405180910390f35b341561066057600080fd5b61068c600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611335565b005b60045442101515610845576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156106f457600080fd5b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb83836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b15156107b857600080fd5b5af115156107c557600080fd5b5050507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf682826001604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a161084a565b600080fd5b5050565b60045481565b600454421015156109f157600a60029054906101000a900460ff16151561087a57600080fd5b600a60009054906101000a900460ff1680156108e357503373ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16145b156109ec57600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6003549081150290604051600060405180830381858888f19350505050156109eb577fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf6600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166003546000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a160006003819055505b5b6109f6565b600080fd5b565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610a7957600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b60085481565b600a60029054906101000a900460ff1681565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008060045442101515610ef757600a60029054906101000a900460ff161515610b1b57600080fd5b600960008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549150600a60009054906101000a900460ff161515610c7a576000821115610c75578273ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f1935050505015610c74576000600960008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf683836000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a15b5b610ef2565b30905081600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231836040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b1515610d3a57600080fd5b5af11515610d4757600080fd5b505050604051805190501015610d5c57600080fd5b6000600960008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8460065485026040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b1515610e6957600080fd5b5af11515610e7657600080fd5b5050507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf683836001604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a15b610efc565b600080fd5b505050565b60096020528060005260406000206000915090505481565b60025481565b60035481565b60045442101515611097576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610f8b57600080fd5b8015611040576001600a60006101000a81548160ff0219169083151502179055507fec3f991caf7857d61663fd1bba1739e04abd4781238508cde554bb849d790c85600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600354604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a161105c565b6000600a60006101000a81548160ff0219169083151502179055505b6001600a60016101000a81548160ff0219169083151502179055506001600a60026101000a81548160ff02191690831515021790555061109c565b600080fd5b50565b600454421015156111fa576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561110557600080fd5b600a60029054906101000a900460ff16151561112057600080fd5b600a60009054906101000a900460ff16156111f5578073ffffffffffffffffffffffffffffffffffffffff166108fc6003549081150290604051600060405180830381858888f19350505050156111f4577fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf6816003546000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a160006003819055505b5b6111ff565b600080fd5b50565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231826040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b15156112e357600080fd5b5af115156112f057600080fd5b5050506040518051905060088190555050565b60055481565b60065481565b600a60019054906101000a900460ff1681565b600a60009054906101000a900460ff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561139057600080fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505600a165627a7a7230582034be72efeb1149a0dd800c680d32fa134dfa130bbb6b1db2ad8cacbddf32648a0029', 
            gas: '4700000'
          }, function (e, contract){
            if(e){
              resolve({
                ifSuccess:false,
                message:e
              });
            }
            console.log(e, contract);
            if (typeof contract.address !== 'undefined') {
                console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
                resolve({
                  ifSuccess:true,
                  message:contract.address
                });
            }
        })
    });
};