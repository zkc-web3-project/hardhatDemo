async function main() {
    const EventDemo = await ethers.getContractFactory("EventDemo");
    const eventDemo = await EventDemo.deploy();
    console.log("eventDemo合约地址:", eventDemo.target);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});