// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract EventDemo {
    // 定义事件（indexed参数最多3个）
    event ValueChanged(
        address indexed user,  // 可索引参数（用于过滤）
        uint256 indexed version, // 第二个索引参数
        string message,        // 非索引参数
        uint256 timestamp      // 非索引参数
    );

    function updateValue(string memory _msg) external {
        // 触发事件（使用emit关键字）
        emit ValueChanged(msg.sender, 2, _msg, block.timestamp);
    }
}