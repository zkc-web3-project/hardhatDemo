const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleERC20", function () {
  let Token, token, owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    Token = await ethers.getContractFactory("SimpleERC20");
    token = await Token.deploy();
    await token.waitForDeployment();
  });

  it("部署后，所有者应存在", async function () {
    expect(await token.owner()).to.equal(owner.address);
  });

  it("mint：所有者可增发代币", async function () {
    const amount = ethers.parseEther("1000");

    await expect(token.connect(owner).mint(user1.address, amount))
      .to.emit(token, "Transfer")
      .withArgs(ethers.ZeroAddress, user1.address, amount);

    expect(await token.balanceOf(user1.address)).to.equal(amount);
    expect(await token.totalSupply()).to.equal(amount);
  });

  it("transfer：账户可正常转账", async function () {
    const amount = ethers.parseEther("1000");
    const sendAmount = ethers.parseEther("100");

    await token.connect(owner).mint(user1.address, amount);

    await expect(token.connect(user1).transfer(user2.address, sendAmount))
      .to.emit(token, "Transfer")
      .withArgs(user1.address, user2.address, sendAmount);

    expect(await token.balanceOf(user1.address)).to.equal(amount - sendAmount);
    expect(await token.balanceOf(user2.address)).to.equal(sendAmount);
  });

  it("approve + transferFrom：授权与代扣", async function () {
    const amount = ethers.parseEther("500");
    const approveAmount = ethers.parseEther("200");
    const transferAmount = ethers.parseEther("100");

    await token.connect(owner).mint(user1.address, amount);

    // 授权 user2 代扣
    await expect(token.connect(user1).approve(user2.address, approveAmount))
      .to.emit(token, "Approval")
      .withArgs(user1.address, user2.address, approveAmount);

    // user2 使用 transferFrom
    await expect(
      token.connect(user2).transferFrom(user1.address, owner.address, transferAmount)
    )
      .to.emit(token, "Transfer")
      .withArgs(user1.address, owner.address, transferAmount);

    // 检查余额变化
    expect(await token.balanceOf(owner.address)).to.equal(transferAmount);
    expect(await token.balanceOf(user1.address)).to.equal(amount - transferAmount);
  });

  it("非所有者不能调用 mint()", async function () {
    await expect(
      token.connect(user1).mint(user1.address, ethers.parseEther("10"))
    ).to.be.revertedWith("Not contract owner");
  });
});
