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
		"constant": false,
		"inputs": [
			{
				"name": "buyerAddress",
				"type": "address"
			},
			{
				"name": "percent",
				"type": "uint256"
			}
		],
		"name": "sendTokenToBuyerByPercent",
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
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "hadSend",
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

util.data = '0x6080604052662386f26fc100006005556000600b60006101000a81548160ff0219169083151502179055506000600b60016101000a81548160ff0219169083151502179055506000600b60026101000a81548160ff02191690831515021790555034801561006c57600080fd5b5060405160a0806122928339810180604052810190808051906020019092919080519060200190929190805190602001909291908051906020019092919080519060200190929190505050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555084600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550670de0b6b3a76400008402600281905550603c830242016004819055508160068190555080600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050506120e1806101b16000396000f30060806040526004361061015f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631e85b7a5146102ea57806329dcb0cf146103015780632e135c541461032c5780633686ca3e1461036f57806338af3eed1461038657806341c0e1b5146103dd57806354a79a0d146103f4578063648baf50146104415780636e66f6e91461047057806370a08231146104c75780637a3a0e841461051e5780637b3e5e7b146105495780638da5cb5b146105745780639b2cb5d8146105cb5780639bfd986e146105f65780639f1bf66614610643578063a035b1fe14610672578063a34328bf1461069d578063ccb07cef146106e0578063d1bbf8381461070f578063d424f62814610766578063d83edd7014610795578063d87ee2ef146107d8578063e169185a14610825578063e69b5a6a14610880578063f2fde38b146108c3578063f65ad55c14610906575b6000600b60019054906101000a900460ff1615151561017d57600080fd5b6004544210151561018d57600080fd5b600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615156101e557600080fd5b34905060055481101580156102005750600254816003540111155b151561020b57600080fd5b80600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550806003600082825401925050819055507f8098cf0563cf36c7339b1b31f144712a27ea613dd22e39438cf1a1e5d3e1a2e66002546003543384604051808581526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200194505050505060405180910390a150005b3480156102f657600080fd5b506102ff610949565b005b34801561030d57600080fd5b50610316610b23565b6040518082815260200191505060405180910390f35b34801561033857600080fd5b5061036d600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610b29565b005b34801561037b57600080fd5b50610384610bdf565b005b34801561039257600080fd5b5061039b610d7c565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156103e957600080fd5b506103f2610da2565b005b34801561040057600080fd5b5061043f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610e37565b005b34801561044d57600080fd5b50610456611291565b604051808215151515815260200191505060405180910390f35b34801561047c57600080fd5b506104856112a4565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156104d357600080fd5b50610508600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506112ca565b6040518082815260200191505060405180910390f35b34801561052a57600080fd5b506105336112e2565b6040518082815260200191505060405180910390f35b34801561055557600080fd5b5061055e6112e8565b6040518082815260200191505060405180910390f35b34801561058057600080fd5b506105896112ee565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156105d757600080fd5b506105e0611313565b6040518082815260200191505060405180910390f35b34801561060257600080fd5b50610641600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611319565b005b34801561064f57600080fd5b506106706004803603810190808035151590602001909291905050506114cd565b005b34801561067e57600080fd5b50610687611632565b6040518082815260200191505060405180910390f35b3480156106a957600080fd5b506106de600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611638565b005b3480156106ec57600080fd5b506106f5611791565b604051808215151515815260200191505060405180910390f35b34801561071b57600080fd5b50610750600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506117a4565b6040518082815260200191505060405180910390f35b34801561077257600080fd5b5061077b6117bc565b604051808215151515815260200191505060405180910390f35b3480156107a157600080fd5b506107d6600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506117cf565b005b3480156107e457600080fd5b50610823600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506119aa565b005b34801561083157600080fd5b50610866600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611b08565b604051808215151515815260200191505060405180910390f35b34801561088c57600080fd5b506108c1600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611b28565b005b3480156108cf57600080fd5b50610904600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611f61565b005b34801561091257600080fd5b50610947600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611fff565b005b6000600b60029054906101000a900460ff1680156109745750600b60009054906101000a900460ff16155b151561097f57600080fd5b6000600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541115156109cd57600080fd5b600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015610b1b576000600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550806003600082825403925050819055507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf633826000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a1610b20565b600080fd5b50565b60045481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610b8457600080fd5b6000600a60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b600b60029054906101000a900460ff161515610bfa57600080fd5b600b60009054906101000a900460ff168015610c6357503373ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16145b1515610c6e57600080fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6003549081150290604051600060405180830381858888f1935050505015610d75577fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf6600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166003546000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a16000600381905550610d7a565b600080fd5b565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610dfd57600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b600080600080600860008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054111515610e8957600080fd5b600b60029054906101000a900460ff168015610eb15750600b60009054906101000a900460ff165b1515610ebc57600080fd5b670de0b6b3a7640000841180610f195750670de0b6b3a7640000600960008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410155b80610f6c5750670de0b6b3a764000084600960008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401115b15610f7657600080fd5b600860008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549250309150670de0b6b3a764000084600654850202811515610fd457fe5b04905080600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231846040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b15801561109557600080fd5b505af11580156110a9573d6000803e3d6000fd5b505050506040513d60208110156110bf57600080fd5b810190808051906020019092919050505010156110db57600080fd5b83600960008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb86836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b1580156111ed57600080fd5b505af1158015611201573d6000803e3d6000fd5b505050507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf6856006548381151561123457fe5b046001604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a15050505050565b600b60029054906101000a900460ff1681565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60086020528060005260406000206000915090505481565b60025481565b60035481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60055481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561137457600080fd5b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb83836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b15801561143957600080fd5b505af115801561144d573d6000803e3d6000fd5b505050507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf682826001604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a15050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561152857600080fd5b80156115dd576001600b60006101000a81548160ff0219169083151502179055507fec3f991caf7857d61663fd1bba1739e04abd4781238508cde554bb849d790c85600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600354604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a16115f9565b6000600b60006101000a81548160ff0219169083151502179055505b6001600b60016101000a81548160ff0219169083151502179055506001600b60026101000a81548160ff02191690831515021790555050565b60065481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561169357600080fd5b600b60029054906101000a900460ff1680156116bb5750600b60009054906101000a900460ff165b15156116c657600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166108fc6003549081150290604051600060405180830381858888f1935050505015611789577fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf6816003546000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a1600060038190555061178e565b600080fd5b50565b600b60019054906101000a900460ff1681565b60096020528060005260406000206000915090505481565b600b60009054906101000a900460ff1681565b6000600b60029054906101000a900460ff1680156117fa5750600b60009054906101000a900460ff16155b151561180557600080fd5b6000600860008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205411151561185357600080fd5b600860008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050156119a1576000600860008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550806003600082825403925050819055507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf682826000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a16119a6565b600080fd5b5050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515611a0557600080fd5b600b60029054906101000a900460ff168015611a2d5750600b60009054906101000a900460ff165b1515611a3857600080fd5b8173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015611aff577fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf682826000604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a180600360008282540392505081905550611b04565b600080fd5b5050565b600a6020528060005260406000206000915054906101000a900460ff1681565b600080600080600860008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054111515611b7a57600080fd5b600b60029054906101000a900460ff168015611ba25750600b60009054906101000a900460ff165b1515611bad57600080fd5b600860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549250309150670de0b6b3a7640000600960008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054670de0b6b3a764000003600654850202811515611c5457fe5b04905080600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231846040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b158015611d1557600080fd5b505af1158015611d29573d6000803e3d6000fd5b505050506040513d6020811015611d3f57600080fd5b81019080805190602001909291905050501080611da35750670de0b6b3a7640000600960008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410155b15611dad57600080fd5b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb85836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b158015611e7257600080fd5b505af1158015611e86573d6000803e3d6000fd5b50505050670de0b6b3a7640000600960008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055507fe842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf68460065483811515611f0557fe5b046001604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182151515158152602001935050505060405180910390a150505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515611fbc57600080fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561205a57600080fd5b6001600a60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550505600a165627a7a7230582021132051a4251cca58b7b9d3fb8b0eaee2e47f48999e60080fd9cdf26a3416b20029';