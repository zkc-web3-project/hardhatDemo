
const hre = require("hardhat")// Hardhat Runtime Environment

const { expect } = require("chai")  //添加断言库chai

describe("MyToken Test", async()=>{ 

    const {ethers} = hre

    const initialSupply = 1000  //初始发行量1000枚

    let MyTokenContract

    beforeEach(async()=>{ 

    [account1,account2] = await ethers.getSigners()
    console.log("账户1:",account1.address)
    console.log("账户2:",account2.address)
    console.log("账户1余额:",await ethers.provider.getBalance(account1.address))
    console.log("账户2余额:",await ethers.provider.getBalance(account2.address))


    const MyToken = await hre.ethers.getContractFactory("MyToken") //工厂模板
    MyTokenContract = await MyToken.connect(account2).deploy(initialSupply)  //account2部署
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

    it("测试转账", async()=>{ 
        await MyTokenContract.transfer(account1.address,100) //account2向account1转账100
        console.log("账户1余额:",await ethers.provider.getBalance(account1.address))
        console.log("账户2余额:",await ethers.provider.getBalance(account2.address))
        expect(await MyTokenContract.balanceOf(account1.address)).to.equal(100)
    })

})
