async function main() {
    const MyContract = await ethers.getContractFactory("MyContract");
    const myContract = await MyContract.deploy();
    console.log("合约地址:", myContract.target);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});