// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SimpleERC20
 * @dev 一个简化版的 ERC20 代币合约，包含基本功能：
 *      - balanceOf: 查询余额
 *      - transfer: 转账
 *      - approve / transferFrom: 授权与代扣
 *      - mint: 仅所有者可增发代币
 */
contract SimpleERC20 {
    // ======== 基本代币信息 ========
    string public name = "Simple Token";
    string public symbol = "SIM";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    // ======== 账户余额与授权信息 ========
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    // ======== 事件定义 ========
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // ======== 所有者 ========
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // ======== 修饰符 ========
    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    // ======== 基础 ERC20 函数 ========

    /// @notice 查询某账户余额
    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    /// @notice 转账函数
    function transfer(address to, uint256 amount) external returns (bool) {
        require(to != address(0), "Invalid address");
        require(_balances[msg.sender] >= amount, "Insufficient balance");

        _balances[msg.sender] -= amount;
        _balances[to] += amount;

        emit Transfer(msg.sender, to, amount);
        return true;
    }

    /// @notice 授权 spender 可以使用 sender 的代币
    function approve(address spender, uint256 amount) external returns (bool) {
        require(spender != address(0), "Invalid spender");

        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    /// @notice 查询授权额度
    function allowance(address tokenOwner, address spender) external view returns (uint256) {
        return _allowances[tokenOwner][spender];
    }

    /// @notice 代扣转账（在被授权额度内）
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(to != address(0), "Invalid address");
        require(_balances[from] >= amount, "Insufficient balance");
        require(_allowances[from][msg.sender] >= amount, "Allowance exceeded");

        _balances[from] -= amount;
        _balances[to] += amount;
        _allowances[from][msg.sender] -= amount;

        emit Transfer(from, to, amount);
        return true;
    }

    // ======== 增发函数 ========

    /// @notice 仅合约所有者可以增发代币
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid address");

        totalSupply += amount;
        _balances[to] += amount;

        emit Transfer(address(0), to, amount);
    }
}
