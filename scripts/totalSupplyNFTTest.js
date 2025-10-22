// scripts/getTotalSupply.js
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // 替换为你的实际合约地址
//   const myNFTAddress = "0x4874Afc24A38B157ACa04f4FE3e15E4878DFCdcB"; // ← 填入你的合约地址
  const myNFTAddress = "0x14688448C43E0fFdEEDD5511a771E1c55742094A";

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