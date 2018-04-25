"use strict";

const rf = require("fs"); 
var path = require('path');
const Web3 = require("web3");
const CONFIG = require('../domain/web3deploy.prepare').CONFIG;
var rpcWeb3 = new Web3(new Web3.providers.HttpProvider(CONFIG.ethereum.rpc));

let util = module.exports;

if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
};

util.guid = function guid(){
    /** it just version 4 guid **/
    function s4(){
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return [s4(), s4(), s4(), s4(), s4(), s4()].join("");
};

util.getDefaltEthAddress = function getDefaltEthAddress(){
    return "0x-eth-contract-address";
};

util.generateTxOfContract = function generateTxOfContract(from, contract, method, amount, receiver){
    let target = receiver.startsWith("0x") ?  receiver.substring(2) : receiver;
    // let gasVal = 90000;
    // let gasValMin = 6000;
    // let gasValMax = 6000000;
    // let gasPrice = 1000000000;
    var preparedTx = {
        from: from,
        to: contract,
        data: [ method, target.padStart(64, '0'), amount.toString(16).padStart(64, '0')].join("")
    };
    // gas:'0x' + gasVal.toString(16),
    // gasPrice:'0x' + gasPrice.toString(16)
    return preparedTx;
};

util.getContractDecimal = function getContractDecimal(contract){
    var tokens = JSON.parse(rf.readFileSync("tokenabi.json","utf-8"));
    var decimal = 1e18;
    tokens.forEach(function(element) {
        if(element.contractAddress.toLowerCase() == contract.toLowerCase()){
            decimal =  element.contractDecimal;
        }
    });
    return decimal;
} 

util.getTransferMethod = function getTransferMethod(contract){
    var tokens = JSON.parse(rf.readFileSync("tokenabi.json","utf-8"));
    var mMethod = "0xa9059cbb";
    tokens.forEach(function(element) {
        if(element.contractAddress.toLowerCase() == contract.toLowerCase()){
            mMethod =  element.contractMethod;
        }
    });
    return mMethod;
} 

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
  
util.getformateDateAndTimeToString  = function getformateDateAndTimeToString()  
{  
    // var time1 = new Date().Format("yyyy-MM-dd");
    var time2 = new Date().Format("yyyy-MM-dd hh:mm:ss");
    return time2;  
};

//线程停留1s  msec = 1000
util.startSleep  = function startSleep(msec){
    var t = Date.now();  
    function sleep(d){  
        while(Date.now - t <= d);  
    }   
    sleep(msec*1000);
};

util.getTokenBalance = function getTokenBalance(contractAddress,address){

    var tokens = JSON.parse(rf.readFileSync("tokenabi.json","utf-8"));
    var tokenBalance = 0;
    tokens.forEach(function(element) {
        if(element.contractAddress.toLowerCase() == contractAddress.toLowerCase()){
            let abi = element.contractAbi;
            var MyContract = rpcWeb3.eth.contract(abi);
            var myContractInstance = MyContract.at(element.contractAddress);
            tokenBalance = myContractInstance.balanceOf(address)/element.contractDecimal;
        }
    });
    return tokenBalance;
};

util.findfile = function findfile(fileName,myfilePath){
    var file = undefined;
    function finder(filePath) {
        let files = rf.readdirSync(filePath);
        files.forEach((name) => {
            let fPath = path.join(filePath,name);
            let stats = rf.statSync(fPath);
            if(stats.isDirectory()) finder(fPath);
            if(stats.isFile()) {
                if(fPath.indexOf(fileName) >= 0){
                    file = fPath;
                }
            }
        });
    }
    finder(myfilePath);
    return file;
};
util.deployGasPrice = 5000000000;
util.gasPrice = 8000000000;
util.abi = [
	{
		"constant": false,
		"inputs": [],
		"name": "buyerSelfRefundEth",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "deadline",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "whiteAddress",
				"type": "address"
			}
		],
		"name": "removeWhiteAddress",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "beneficiaryWithdrawal",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "beneficiary",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "kill",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "ownerCheckGoalReached",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "tokenReward",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "fundingGoal",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "amountRaised",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "minAmount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "toAddress",
				"type": "address"
			},
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "ownerTransferToken",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "isSuccess",
				"type": "bool"
			}
		],
		"name": "ownerCheckGoalIfReached",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "price",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "toAddress",
				"type": "address"
			}
		],
		"name": "ownerDealWithEth",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "crowdsaleClosed",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "fundingGoalReached",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "buyerAddress",
				"type": "address"
			}
		],
		"name": "refundEth",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "toAddress",
				"type": "address"
			},
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "ownerDealWithEthCoins",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "whiteAddressesOf",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "buyerAddress",
				"type": "address"
			}
		],
		"name": "sendTokenToBuyer",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "whiteAddress",
				"type": "address"
			}
		],
		"name": "addWhiteAddress",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "ifSuccessfulSendTo",
				"type": "address"
			},
			{
				"name": "fundingGoalInEthers",
				"type": "uint256"
			},
			{
				"name": "durationInMinutes",
				"type": "uint256"
			},
			{
				"name": "finneyCostOfEachToken",
				"type": "uint256"
			},
			{
				"name": "addressOfTokenUsedAsReward",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "totalAmountRaised",
				"type": "uint256"
			}
		],
		"name": "GoalReached",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "backer",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "isContribution",
				"type": "bool"
			}
		],
		"name": "FundTransfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "fundingGoal",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "amountRaised",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "fromAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferEvent",
		"type": "event"
	}
];

util.data = '0x6080604052662386f26fc100006005556000600a60006101000a81548160ff0219169083151502179055506000600a60016101000a81548160ff0219169083151502179055506000600a60026101000a81548160ff02191690831515021790555034801561006c57600080fd5b5060405160a080611ca38339810180604052810190808051906020019092919080519060200190929190805190602001909291908051906020019092919080519060200190929190505050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555084600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550670de0b6b3a76400008402600281905550603c830242016004819055508160068190555080600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505050611af2806101b16000396000f300608060405260043610610149576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631e85b7a5146102d457806329dcb0cf146102eb5780632e135c54146103165780633686ca3e1461035957806338af3eed1461037057806341c0e1b5146103c7578063648baf50146103de5780636e66f6e91461040d57806370a08231146104645780637a3a0e84146104bb5780637b3e5e7b146104e65780638da5cb5b146105115780639b2cb5d8146105685780639bfd986e146105935780639f1bf666146105e0578063a035b1fe1461060f578063a34328bf1461063a578063ccb07cef1461067d578063d424f628146106ac578063d83edd70146106db578063d87ee2ef1461071e578063e169185a1461076b578063e69b5a6a146107c6578063f2fde38b14610809578063f65ad55c1461084c575b6000600a60019054906101000a900460ff1615151561016757600080fd5b6004544210151561017757600080fd5b600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615156101cf57600080fd5b34905060055481101580156101ea5750600254816003540111155b15156101f557600080fd5b80600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550806003600082825401925050819055507f8098cf0563cf36c7339b1b31f144712a27ea613dd22e39438cf1a1e5d3e1a2e66002546003543384604051808581526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200194505050505060405180910390a150005b3480156102e057600080fd5b506102e961088f565b005b3480156102f757600080fd5b50610300610a69565b6040518082815260200191505060405180910390f35b34801561032257600080fd5b50610357600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610a6f565b005b34801561036557600080fd5b5061036e610b25565b005b34801561037c57600080fd5b50610385610cc2565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156103d357600080fd5b506103dc610ce8565b005b3480156103ea57600080fd5b506103f3610d7d565b604051808215151515815260200191505060405180910390f35b34801561041957600080fd5b50610422610d90565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561047057600080fd5b506104a5600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610db6565b6040518082815260200191505060405180910390f35b3480156104c757600080fd5b506104d0610dce565b6040518082815260200191505060405180910390f35b3480156104f257600080fd5b506104fb610dd4565b6040518082815260200191505060405180910390f35b34801561051d57600080fd5b50610526610dda565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561057457600080fd5b5061057d610dff565b6040518082815260200191505060405180910390f35b34801561059f57600080fd5b506105de600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610e05565b005b3480156105ec57600080fd5b5061060d600480360381019080803515159060200190929190505050610fb9565b005b34801561061b57600080fd5b5061062461111e565b6040518082815260200191505060405180910390f35b34801561064657600080fd5b5061067b600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611124565b005b34801561068957600080fd5b5061069261127d565b604051808215151515815260200191505060405180910390f35b3480156106b857600080fd5b506106c1611290565b604051808215151515815260200191505060405180910390f35b3480156106e757600080fd5b5061071c600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506112a3565b005b34801561072a57600080fd5b50610769600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061147e565b005b34801561077757600080fd5b506107ac600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506115dc565b604051808215151515815260200191505060405180910390f35b3480156107d257600080fd5b50610807600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506115fc565b005b34801561081557600080fd5b5061084a600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611972565b005b34801561085857600080fd5b5061088d600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611a10565b005b6000600a60029054906101000a900460ff1680156108ba5750600a60009054906101000a900460ff16155b15156108c557600080fd5b6000600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205411151561091357600080fd5b600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015610a61576000600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550806003600082825403925050819055507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf633826000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a1610a66565b600080fd5b50565b60045481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610aca57600080fd5b6000600960008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b600a60029054906101000a900460ff161515610b4057600080fd5b600a60009054906101000a900460ff168015610ba957503373ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16145b1515610bb457600080fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6003549081150290604051600060405180830381858888f1935050505015610cbb577fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf6600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166003546000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a16000600381905550610cc0565b600080fd5b565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610d4357600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b600a60029054906101000a900460ff1681565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60086020528060005260406000206000915090505481565b60025481565b60035481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60055481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610e6057600080fd5b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb83836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b158015610f2557600080fd5b505af1158015610f39573d6000803e3d6000fd5b505050507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf682826001604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a15050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561101457600080fd5b80156110c9576001600a60006101000a81548160ff0219169083151502179055507fec3f991caf7857d61663fd1bba1739e04abd4781238508cde554bb849d790c85600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600354604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a16110e5565b6000600a60006101000a81548160ff0219169083151502179055505b6001600a60016101000a81548160ff0219169083151502179055506001600a60026101000a81548160ff02191690831515021790555050565b60065481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561117f57600080fd5b600a60029054906101000a900460ff1680156111a75750600a60009054906101000a900460ff165b15156111b257600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166108fc6003549081150290604051600060405180830381858888f1935050505015611275577fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf6816003546000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a1600060038190555061127a565b600080fd5b50565b600a60019054906101000a900460ff1681565b600a60009054906101000a900460ff1681565b6000600a60029054906101000a900460ff1680156112ce5750600a60009054906101000a900460ff16155b15156112d957600080fd5b6000600860008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205411151561132757600080fd5b600860008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015611475576000600860008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550806003600082825403925050819055507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf682826000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a161147a565b600080fd5b5050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156114d957600080fd5b600a60029054906101000a900460ff1680156115015750600a60009054906101000a900460ff165b151561150c57600080fd5b8173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050156115d3577fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf682826000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a1806003600082825403925050819055506115d8565b600080fd5b5050565b60096020528060005260406000206000915054906101000a900460ff1681565b600080600860008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549150309050600a60029054906101000a900460ff16801561166c5750600a60009054906101000a900460ff165b151561167757600080fd5b6006548202600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231836040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b15801561173957600080fd5b505af115801561174d573d6000803e3d6000fd5b505050506040513d602081101561176357600080fd5b81019080805190602001909291905050501015151561178157600080fd5b6000600860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541115156117cf57600080fd5b6000600860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8460065485026040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b1580156118dd57600080fd5b505af11580156118f1573d6000803e3d6000fd5b505050507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf683836001604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a1505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156119cd57600080fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515611a6b57600080fd5b6001600960008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550505600a165627a7a7230582056dc5b5f7519944f1e176c0e8dff427fe1b4c7a54a86feb73fb874892afee9e20029';