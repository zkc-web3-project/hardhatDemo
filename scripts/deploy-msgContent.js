async function main() {
    const getMsgContent = await ethers.getContractFactory("getMsgContent");
    const msgContract = await getMsgContent.deploy();
    console.log("msgContent合约地址:", msgContract.target);
    //调用msgContract中的函数getMsgValue
    const msgSender = await msgContract.getMsgSender();
    const msgData = await msgContract.getMsgData();
    const msgValue = await msgContract.getMsgValue();
    console.log("msgSender===========>", msgSender);
    console.log("msgData=============>", msgData);
    console.log("msgValue=============>", msgValue);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
