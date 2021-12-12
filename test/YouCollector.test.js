const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('YouCollector', () => {
  it("Should return the new greeting once it's changed", async () => {
    const YouCollector = await ethers.getContractFactory('YouCollector')
    const greeter = await YouCollector.deploy('Hello, world!')
    await greeter.deployed()

    // expect(await greeter.greet()).to.equal('Hello, world!')

    // const setGreetingTx = await greeter.setGreeting('Hola, mundo!')

    // // wait until the transaction is mined
    // await setGreetingTx.wait()

    // expect(await greeter.greet()).to.equal('Hola, mundo!')
  })
})
