async function main() {
   console.log("开始部署合约...");
  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 获取合约工厂并部署
  const MyNFT = await ethers.getContractFactory("MyNFT");
  // 将部署者地址作为参数传递给构造函数
  const myNFT = await MyNFT.deploy(deployer.address);

  await myNFT.waitForDeployment();
  const address = await myNFT.getAddress();
  console.log("MyNFT deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });