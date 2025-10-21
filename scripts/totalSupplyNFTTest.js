// scripts/getTotalSupply.js
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // 替换为你的实际合约地址
  const myNFTAddress = "0x1234...abc"; // ← 填入你的合约地址

  const MyNFT = await ethers.getContractFactory("MyNFT");
  const myNFT = await MyNFT.attach(myNFTAddress);

  // 调用 totalSupply 函数
  const supply = await myNFT.totalSupply();
  console.log("Total Supply:", supply.toString());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});