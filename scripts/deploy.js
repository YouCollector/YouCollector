const fs = require('fs')
const path = require('path')

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')

const contractsSaveLocation = path.resolve(`../YouCollector/contracts/${hre.network.name}.json`)

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const YouCollectorLibrary = await hre.ethers.getContractFactory('YouCollectorLibrary')
  const youCollectorLibrary = await YouCollectorLibrary.deploy()

  await youCollectorLibrary.deployed()

  const YouCollector = await hre.ethers.getContractFactory('YouCollector', {
    libraries: {
      YouCollectorLibrary: youCollectorLibrary.address,
    },
  })
  const youCollector = await YouCollector.deploy()

  await youCollector.deployed()

  console.log('YouCollector deployed to:', youCollector.address)

  const contracts = {
    YouCollector: {
      address: youCollector.address,
      abi: youCollector.interface.abi,
    },
  }

  fs.writeFileSync(contractsSaveLocation, JSON.stringify(contracts), 'utf-8')

  console.log('Contracts addresses saved to:', contractsSaveLocation)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
