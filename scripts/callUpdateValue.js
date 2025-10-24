import { ethers } from "ethers";

// ====== 配置信息 ======
const RPC_URL = "https://sepolia.infura.io/v3/aab47bf44d3b4988916ae6383cb5d490"; // 替换为你的 RPC 节点
const PRIVATE_KEY = "a430ee17e89cca50cee9ae5f8718875e8461e65a1960627f87f7f4b704a56167"; // 替换为你的钱包私钥（务必保密！）
const CONTRACT_ADDRESS = "0xE121Dd47C90f4e8A3cAFaea9F0546c2286d9C820"; // 替换为已部署合约地址
console.log("配置信息: ", RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS)

// ====== 合约 ABI ======
const ABI = [
  "function updateValue(string _msg) external",
  "event ValueChanged(address indexed user, uint256 indexed version, string message, uint256 timestamp)"
];

// ====== 主函数 ======
async function main() {
  // 创建 provider（连接到 RPC 节点）
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  // 使用私钥创建 signer（钱包）
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // 连接合约
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  console.log("调用 updateValue() 函数...");

  // 调用合约函数（发送交易）
  const tx = await contract.updateValue("Hello from JS!");
  console.log("交易已发送，等待确认...");
  console.log("交易哈希:", tx.hash);

  // 等待交易确认
  const receipt = await tx.wait();
  console.log("交易已确认，区块号:", receipt.blockNumber);

  // 打印事件日志（如果有）
  console.log("事件日志:");
  receipt.logs.forEach((log, i) => console.log(`  Log ${i + 1}:`, log));
}

// 执行主函数
main().catch((err) => {
  console.error("出错啦:", err);
});
