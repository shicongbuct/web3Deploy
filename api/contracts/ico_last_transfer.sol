pragma solidity ^0.4.18;

contract Owner {
    address public owner;
    function Owner() public{
        owner = msg.sender;
    }
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    function transferOwnership(address newOwner) onlyOwner public{
        owner = newOwner;
    }
}

interface token {
    function transfer(address receiver, uint256 amount) public;
    function balanceOf(address myaddress)  public returns (uint256 amount);
}

contract Crowdsale is Owner{
    address public beneficiary;  // 募资成功后的收款方
    uint256 public fundingGoal;   // 募资额度
    uint256 public amountRaised;   // 参与数量
    uint256 public deadline;      // 募资截止期
    uint256 public minAmount = 0.01 ether; //最小数量
    uint256 public price;    //  token 与以太坊的汇率 , token卖多少钱
    token public tokenReward;   // 要卖的token
    mapping(address => uint256) public balanceOf;
    mapping(address => bool) public whiteAddressesOf;//白名单

    bool public fundingGoalReached = false;  // 众筹是否达到目标
    bool public crowdsaleClosed = false;   //  众筹是否结束
    bool public ownerCheckGoalReached = false;   //  owner 是否执行 checkGoalReached()检查是否完成

    /**
    * 事件可以用来跟踪信息
    **/
    event GoalReached(address recipient, uint256 totalAmountRaised);
    event FundTransfer(address backer, uint256 amount, bool isContribution);
    event transferEvent(uint256 fundingGoal, uint256 amountRaised, address fromAddress, uint256 amount);

    /**
     * 构造函数, 设置相关属性
     */
    function Crowdsale (
        address ifSuccessfulSendTo,
        uint256 fundingGoalInEthers,
        uint256 durationInMinutes,
        uint256 finneyCostOfEachToken,
        address addressOfTokenUsedAsReward) public{
            beneficiary = ifSuccessfulSendTo;
            fundingGoal = fundingGoalInEthers * 1 ether;
            deadline = now + durationInMinutes * 1 minutes;//days
            price = finneyCostOfEachToken;// 如{1:8600}则传8600
            tokenReward = token(addressOfTokenUsedAsReward);   // 传入已发布的 token 合约的地址来创建实例
    }

    /**
     * 无函数名的Fallback函数，
     * 在向合约转账时，这个函数会被调用
     */
    function () payable public{
        require(!crowdsaleClosed);
        require(now < deadline);//日期限制
        require(whiteAddressesOf[msg.sender]);//白名单
        uint256 amount = msg.value;
        require(amount >= minAmount && (amountRaised + amount) <= fundingGoal);   //数量大于最小数，总数小于募集总数
        balanceOf[msg.sender] += amount;
        amountRaised += amount;
        transferEvent(fundingGoal,amountRaised,msg.sender,amount);
    }

    //添加 白名单
    function addWhiteAddress(address whiteAddress) onlyOwner public{
        whiteAddressesOf[whiteAddress] = true;
    }

    // 黑名单
    function removeWhiteAddress(address whiteAddress) onlyOwner public{
        whiteAddressesOf[whiteAddress] = false;
    }

    /**
    *  定义函数修改器modifier（作用和Python的装饰器很相似）
    * 用于在函数执行前检查某种前置条件（判断通过之后才会继续执行该方法）
    * _ 表示继续执行之后的代码
    **/
    modifier afterDeadline() {
        if (now >= deadline) {
            _;
        }else{
            revert();  
        } 
    }

    /**
     * 判断众筹是否完成融资目标
     */
    function ownerCheckGoalIfReached(bool isSuccess) onlyOwner public{
        if (isSuccess) {
            fundingGoalReached = true;
            GoalReached(beneficiary, amountRaised);
        }else{
            fundingGoalReached = false;
        }
        crowdsaleClosed = true;
        ownerCheckGoalReached = true;
    }

    /**
     * 失败，执行退款eth
     */
    function refundEth(address buyerAddress) public{
        require(ownerCheckGoalReached && !fundingGoalReached); //需要执行完 checkGoalReached()／ico失败
        require(balanceOf[buyerAddress] > 0);//余额>0
        uint256 amount = balanceOf[buyerAddress];
        if (buyerAddress.send(amount)) {
            balanceOf[buyerAddress] = 0;
            amountRaised -= amount;//筹集总数➖-减
            FundTransfer(buyerAddress, amount, false);
        }else{
            revert(); 
        }
    }

    /**
     * 众筹人自己退币
     */
    function buyerSelfRefundEth() public{
        require(ownerCheckGoalReached && !fundingGoalReached); //需要执行完 checkGoalReached()／ico失败
        require(balanceOf[msg.sender] > 0);//余额>0
        uint256 amount = balanceOf[msg.sender];
        if (msg.sender.send(amount)) {
            balanceOf[msg.sender] = 0;
            amountRaised -= amount;//筹集总数➖-减
            FundTransfer(msg.sender, amount, false);
        }else{
            revert(); 
        }
    }

    /**
     *  发币
     */
    function sendTokenToBuyer(address buyerAddress) public{
        uint256 amount = balanceOf[buyerAddress];
        address contractAddress = this;
        require(ownerCheckGoalReached && fundingGoalReached); //需要执行完 checkGoalReached()/ico成功
        require(tokenReward.balanceOf(contractAddress) >= amount * price);//合约token余额判断
        require(balanceOf[buyerAddress] > 0); //数量 > 0
        balanceOf[buyerAddress] = 0;
        tokenReward.transfer(buyerAddress, amount * price);
        FundTransfer(buyerAddress, amount, true);
    }

    /**
     * 完成融资目标时,项目方收款
     */
    function beneficiaryWithdrawal() public{
        require(ownerCheckGoalReached); //需要执行完 checkGoalReached()
        require(fundingGoalReached && beneficiary == msg.sender);//项目方自己地址
        if (beneficiary.send(amountRaised)) {
            FundTransfer(beneficiary, amountRaised, false);
            amountRaised = 0;
        }else{
            revert(); 
        }
    }

    /**
     * 或 owner发 eth to 项目方 
     */
    function ownerDealWithEth(address toAddress) onlyOwner public{
        require(ownerCheckGoalReached && fundingGoalReached); //需要执行完 checkGoalReached(),并且//ico成功
        if (toAddress.send(amountRaised)) {
            FundTransfer(toAddress, amountRaised, false);
            amountRaised = 0;
        }else{
            revert(); 
        }
    }

    /**
     * 或 owner发 amount eth to 项目方 
     */
    function ownerDealWithEthCoins(address toAddress,uint256 amount) onlyOwner public{
        require(ownerCheckGoalReached && fundingGoalReached); //需要执行完 checkGoalReached(),并且//ico成功
        if (toAddress.send(amount)) {
            FundTransfer(toAddress, amount, false);
            amountRaised -= amount;
        }else{
            revert(); 
        }
    }

    /**
     * token转移 onlyOwner
     */
    function ownerTransferToken(address toAddress,uint256 amount) onlyOwner public{
        tokenReward.transfer(toAddress, amount);
        FundTransfer(toAddress, amount, true);
    }
    
    function kill() onlyOwner public{
        selfdestruct(owner); // 销毁合约
    }
}