// testPriceConsumer.js
const { ethers } = require("ethers");
require("dotenv").config();

// 配置测试网络参数
const RPC_URL = "https://sepolia.infura.io/v3/aab47bf44d3b4988916ae6383cb5d490";
const PRIVATE_KEY = "a430ee17e89cca50cee9ae5f8718875e8461e65a1960627f87f7f4b704a56167";

// Chainlink预言机合约地址（以ETH/USD为例）
// const AGGREGATOR_ADDRESS = "0xB0C712f98daE15264c8E26132BCC91C40aD4d5F9";
//BTC-USD
const AGGREGATOR_ADDRESS = "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43";  //这里对应的是币对的合约地址，是合约地址！

// 合约ABI（自动生成或从编译文件获取）
const PRICE_CONSUMER_ABI = [
  "function getLatestPrice() public view returns (int256)",
  "event PriceUpdated(int256 price)"
];

async function main() {
  try {
    // 1. 连接钱包和提供者
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);


    // 1. 加载合约元数据（需从 artifacts 目录获取）
const PriceConsumerJson = require("../artifacts/contracts/PriceConsumer.sol/PriceConsumer.json");
    // 2. 部署合约
    // 2. 创建合约工厂（必须使用 new 关键字）
const factory = new ethers.ContractFactory(
  PriceConsumerJson.abi,    // 必须显式传递 ABI
  PriceConsumerJson.bytecode, // 必须显式传递字节码
  wallet                    // 钱包实例
);

// 3. 部署合约（注意参数传递位置）
const priceConsumer = await factory.deploy(AGGREGATOR_ADDRESS);
await priceConsumer.waitForDeployment();

console.log("合约部署地址:", priceConsumer.target);

    // 3. 调用getLatestPrice函数
const result = await priceConsumer.getLatestPrice();
console.log("最新价格（原始值）:", result.toString());

// 4. 解析价格（根据小数位转换）
const priceFeedAddress = await priceConsumer.priceFeed();
const priceFeed = new ethers.Contract(priceFeedAddress, [
  "function decimals() external view returns (uint8)"
], provider);
const decimals = await priceFeed.decimals();

// ✅ 确保 result 是 BigNumber，不是 TransactionResponse
const price = ethers.formatUnits(result, decimals);
console.log("格式化价格（USD）:", price);
    // 5. 验证价格有效性
    if (result==0n) {
      throw new Error("获取到零值价格，请检查预言机连接！");
    }

    // 6. 监听价格更新事件（可选）
    priceConsumer.on("PriceUpdated", (newPrice) => {
      console.log("价格更新事件捕获:", ethers.formatUnits(newPrice, decimals));
    });

  } catch (error) {
    console.error("测试失败:", error.message);
    process.exit(1);
  }
}

// 执行测试
main();