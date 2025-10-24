const { ethers } = require('ethers');


const RPC_URL = "https://sepolia.infura.io/v3/aab47bf44d3b4988916ae6383cb5d490"; // 替换为你的 RPC 节点
const CONTRACT_ADDRESS = "0xE121Dd47C90f4e8A3cAFaea9F0546c2286d9C820"; // 替换为已部署合约地址


// ===== 合约 ABI（只需要事件声明）=====
const ABI = [
  "event ValueChanged(address indexed user, uint256 indexed version, string message, uint256 timestamp)"
];

async function main() {
  console.log("👂 正在监听合约事件...");

  // 创建 provider（只读，不需要私钥）
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  // 连接合约
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

  // 监听事件
  contract.on("ValueChanged", (user, version, message, timestamp, event) => {
    console.log("  检测到 ValueChanged 事件:");
    console.log("  用户地址:", user);
    console.log("  版本号:", version.toString());
    console.log("  消息内容:", message);
    console.log("  时间戳:", new Date(timestamp * 1000).toLocaleString());
    console.log("  区块号:", event.blockNumber);
    console.log("-----------------------------");
  });
}

// 启动监听
main().catch(console.error);