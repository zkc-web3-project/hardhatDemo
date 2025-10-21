async function main() {
  const [owner] = await ethers.getSigners();
  const myNFTAddress = "0x70b49797B466c42f143C1070cDD70E57a65f9CbB";

  const MyNFT = await ethers.getContractFactory("MyNFT");
  const myNFT = await MyNFT.attach(myNFTAddress);

  const tx = await myNFT.withdraw();
  await tx.wait();
  console.log("Withdrawal successful!");
}