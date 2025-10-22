async function main() {
   console.log("开始部署合约MyToken...");

  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 获取合约工厂并部署
  const MyToken = await ethers.getContractFactory("MyToken");
  // 将部署者地址作为参数传递给构造函数
  const mt = await MyToken.deploy(deployer.address);

  await mt.waitForDeployment();
  const address = await mt.getAddress();
  console.log("MyToken deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });