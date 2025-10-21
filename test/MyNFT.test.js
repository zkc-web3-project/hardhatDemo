const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT Contract", function () {
  let MyNFT;
  let myNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // 获取合约工厂和账户
    MyNFT = await ethers.getContractFactory("MyNFT");
    [owner, addr1, addr2] = await ethers.getSigners();

    // 部署合约，将部署者设置为初始所有者
    myNFT = await MyNFT.deploy(owner.address);
    await myNFT.waitForDeployment();
  });

  it("Should have correct name and symbol", async function () {
    expect(await myNFT.name()).to.equal("MyNFT");
    expect(await myNFT.symbol()).to.equal("MNFT");
  });

  it("Should allow minting NFTs with correct payment", async function () {
    const mintPrice = await myNFT.PRICE();
    
    // 测试铸造
    await expect(myNFT.connect(addr1).mint(addr1.address, { value: mintPrice }))
      .to.emit(myNFT, "Transfer") // 检查是否触发了 Transfer 事件
      .withArgs(ethers.ZeroAddress, addr1.address, 0); // 事件参数：from, to, tokenId :cite[3]

    // 验证 NFT 所有权
    expect(await myNFT.ownerOf(0)).to.equal(addr1.address);
    expect(await myNFT.totalSupply()).to.equal(1);
  });

  it("Should fail minting without correct payment", async function () {
    const mintPrice = await myNFT.PRICE();
    const incorrectPrice = mintPrice / 2n; // 支付错误金额

    await expect(
      myNFT.connect(addr1).mint(addr1.address, { value: incorrectPrice })
    ).to.be.revertedWith("Incorrect ether sent"); // 应该被回退
  });

  it("Should allow owner to withdraw funds", async function () {
    const mintPrice = await myNFT.PRICE();
    await myNFT.connect(addr1).mint(addr1.address, { value: mintPrice });

    // 检查合约余额
    const contractBalanceBefore = await ethers.provider.getBalance(await myNFT.getAddress());
    expect(contractBalanceBefore).to.equal(mintPrice);

    // 所有者提取资金
    await expect(myNFT.connect(owner).withdraw())
      .to.changeEtherBalance(owner, mintPrice); // 检查所有者余额变化 :cite[1]

    // 验证合约余额为零
    const contractBalanceAfter = await ethers.provider.getBalance(await myNFT.getAddress());
    expect(contractBalanceAfter).to.equal(0);
  });
});