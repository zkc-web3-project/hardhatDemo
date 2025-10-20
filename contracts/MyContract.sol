// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    uint256 public myNumber;

    function setNumber(uint256 _num) public {
        myNumber = _num;
    }
}