// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    uint256 private _nextTokenId;
    uint256 public constant MAX_SUPPLY = 10000; // 最大供应量
    uint256 public constant PRICE = 0.001 ether; // 固定铸造价格

    constructor(address initialOwner)
        ERC721("MyNFT", "MNFT")
        Ownable(initialOwner)
    {}

    // 铸造函数，用户支付一定费用即可铸造
    function mint(address to) public payable {
        require(totalSupply() < MAX_SUPPLY, "Max supply reached");
        require(msg.value == PRICE, "Incorrect ether sent");

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    // 仅合约所有者可以调用，用于提取合约余额
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    // 获取当前已铸造的NFT数量
    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }
}