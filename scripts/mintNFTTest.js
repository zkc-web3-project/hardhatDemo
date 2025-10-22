async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // 替换为你的实际合约地址
//   const myNFTAddress = "0x4874Afc24A38B157ACa04f4FE3e15E4878DFCdcB"; // ← 填入你的合约地址
  const myNFTAddress = "0x14688448C43E0fFdEEDD5511a771E1c55742094A"; // ← 填入你的合约地址

  //图片元数据CID
  const CID = "ipfs://bafkreibkhroyxrtlpdejxvztwzdmywkv4ebnsv6vyv6pom5fss5bpqdtmm";

  const MyNFT = await ethers.getContractFactory("MyNFT");
  const myNFT = await MyNFT.attach(myNFTAddress); // 使用 attach 连接已有合约

  // 示例：调用 mint 函数
  const tx = await myNFT.mint(deployer.address, CID, { value: ethers.parseEther("0.001") });
  await tx.wait();
  console.log("Minted successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });