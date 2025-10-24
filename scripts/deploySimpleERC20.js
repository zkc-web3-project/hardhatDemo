const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 正在部署 SimpleERC20 合约...");

  // 获取部署账户
  const [deployer] = await ethers.getSigners();
  console.log("部署账户地址:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("账户余额:", ethers.formatEther(balance), "ETH");

  // 部署合约
  const Token = await ethers.getContractFactory("SimpleERC20");
  const token = await Token.deploy();
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("✅ 合约已部署成功!");
  console.log("合约地址:", address);

  // 显示初始状态
  const owner = await token.owner();
  console.log("合约所有者:", owner);

  // 可选：自动增发一些代币
  const mintTx = await token.mint(deployer.address, ethers.parseEther("1000"));
  await mintTx.wait();
  console.log("💰 已为部署者增发 1000 SIM 代币");

  const totalSupply = await token.totalSupply();
  console.log("当前总供应量:", ethers.formatEther(totalSupply), "SIM");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 部署出错:", error);
    process.exit(1);
  });
