// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract getMsgContent{
    function getMsgSender() public view returns(address){
        return msg.sender;
    }

    function getMsgData() public pure returns(bytes memory){
        return msg.data;
    }

    function getMsgValue() public payable returns(uint256){
        return msg.value;
    }
    

}