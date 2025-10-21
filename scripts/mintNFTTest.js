async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // 替换为你的实际合约地址
  const myNFTAddress = "0x70b49797B466c42f143C1070cDD70E57a65f9CbB"; // ← 填入你的合约地址

  const MyNFT = await ethers.getContractFactory("MyNFT");
  const myNFT = await MyNFT.attach(myNFTAddress); // 使用 attach 连接已有合约

  // 示例：调用 mint 函数
  const tx = await myNFT.mint(deployer.address, { value: ethers.parseEther("0.001") });
  await tx.wait();
  console.log("Minted successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});