// test/BeggingContract.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("开始部署并测试BeggingContract合约函数功能...", function () {
  let contract;
  let owner;
  let user1;
  let user2;
  const DONATION_AMOUNT = ethers.parseEther("0.1");
  const MULTIPLE_DONATIONS = 5;

  beforeEach(async function () {
    // 获取测试账户
    [owner, user1, user2] = await ethers.getSigners(); //这里使用本地测试账户

    // 部署合约 (更新的部署方式)
    const ContractFactory = await ethers.getContractFactory("BeggingContract");
    contract = await ContractFactory.deploy();
    await contract.waitForDeployment(); // 替换 deployed() 方法
    console.log("合约部署成功，合约地址:", await contract.getAddress()); // 获取地址的新方法
  });

  describe("捐赠功能测试", function () {
    it("应正确记录单次捐赠", async function () {
      await contract.connect(user1).donate({ value: DONATION_AMOUNT });
      
      const balance = await contract.getDonation(user1.address);
      expect(balance).to.equal(DONATION_AMOUNT);
    });

    it("应累计多次捐赠金额", async function () {
      for (let i = 0; i < MULTIPLE_DONATIONS; i++) {
        await contract.connect(user1).donate({ value: DONATION_AMOUNT });
      }
      
      const expected = DONATION_AMOUNT * BigInt(MULTIPLE_DONATIONS);
      const balance = await contract.getDonation(user1.address);
      expect(balance).to.equal(expected);
    });

    it("应拒绝零金额捐赠", async function () {
      await expect(
        contract.connect(user1).donate({ value: 0 })
      ).to.be.revertedWith("Donation amount must be greater than zero");
    });
  });

  describe("提款功能测试", function () {
    beforeEach(async function () {
      // 预先捐赠资金
      await contract.connect(user1).donate({ value: DONATION_AMOUNT });
      await contract.connect(user2).donate({ value: DONATION_AMOUNT });
    });

    it("所有者可成功提取资金", async function () {
      const initialBalance = await ethers.provider.getBalance(owner.address);
      
      await expect(contract.connect(owner).withdraw())
        .to.emit(contract, "Withdrawn")
        .withArgs(owner.address, DONATION_AMOUNT * BigInt(2));

      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("非所有者提款应失败", async function () {
      await expect(
        contract.connect(user1).withdraw()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("提款后合约余额应归零", async function () {
      await contract.connect(owner).withdraw();
      const balance = await ethers.provider.getBalance(await contract.getAddress()); // 使用新方法获取地址
      expect(balance).to.equal(0);
    });
  });

  describe("边界条件测试", function () {
    it("应处理大额捐赠（接近Gas限制）", async function () {
      const maxDonation = ethers.parseEther("1000");
      await contract.connect(owner).donate({ value: maxDonation });
      const balance = await contract.getDonation(owner.address);
      expect(balance).to.equal(maxDonation);
    });

    it("应正确处理多账户捐赠", async function () {
      const donations = [user1, user2, owner];
      for (const donor of donations) {
        await contract.connect(donor).donate({ value: DONATION_AMOUNT });
      }

      for (const donor of donations) {
        const balance = await contract.getDonation(donor.address);
        expect(balance).to.equal(DONATION_AMOUNT);
      }
    });
  });
});