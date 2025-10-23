
const hre = require("hardhat")// Hardhat Runtime Environment

const { expect } = require("chai")  //添加断言库chai

describe("MyToken Test", async()=>{ 

    const {ethers} = hre

    const initialSupply = 1000  //初始发行量1000枚

    let MyTokenContract

    beforeEach(async()=>{ 

    const MyToken = await hre.ethers.getContractFactory("MyToken") //工厂模板
    MyTokenContract = await MyToken.deploy(initialSupply)
    MyTokenContract.waitForDeployment()
    const contractAddr = await MyTokenContract.getAddress()
    console.log("合约地址:",contractAddr)

    expect(contractAddr).to.length.greaterThan(0)

    })

    it("合约部署好了，name,symbol,decimal", async()=>{
        expect(await MyTokenContract.name()).to.equal("MyToken")
        expect(await MyTokenContract.symbol()).to.equal("MTK")
        expect(await MyTokenContract.decimals()).to.equal(18) 
        console.log("合约地址:",MyTokenContract.getAddress())
        console.log("合约余额:",await ethers.provider.getBalance(MyTokenContract.getAddress()))
        console.log("合约代币余额:",await MyTokenContract.balanceOf(MyTokenContract.getAddress()))
    })

})
