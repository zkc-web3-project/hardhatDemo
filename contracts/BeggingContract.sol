// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BeggingContract is Ownable{
    //定义每个捐赠者对应的捐赠金额
    mapping(address => uint256) public donations;
    //捐赠事件
    event Donated(address indexed donor, uint256 amount);
    //提现事件
    event Withdrawn(address indexed recipient, uint256 amount);

    //构造函数 初始化合约拥有者
    constructor() Ownable(msg.sender) {
      // 合约部署者将成为初始所有者
    }

    //一个 donate 函数，允许用户向合约发送以太币，并记录捐赠信息
    function donate() external payable{
        require(msg.value > 0, "Donation amount must be greater than zero");
        donations[msg.sender] += msg.value;
        emit Donated(msg.sender, msg.value);
    }

    //一个 withdraw 函数，允许合约所有者提取所有资金
    function withdraw() external onlyOwner{
       uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");  //低级调用，表示向合约所有者地址转账balance数量的代币，""表示不调用任何特定函数，只是纯转账
        require(success, "Withdrawal failed");
        
        emit Withdrawn(owner(), balance);
    }
    //一个 getDonation 函数，允许查询某个地址的捐赠金额
    function getDonation(address addr) external view returns(uint256){
        return donations[addr];
    }

    //回退函数，处理为匹配的函数调用(兜底)
    receive() external payable {
        this.donate(); //这里必须加this.或者将函数声明为public
    }


}