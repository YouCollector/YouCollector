const fs = require('fs')
const path = require('path')

const hre = require('hardhat')

const contractsSaveLocation = path.resolve(__dirname, `../YouCollector/contracts/${hre.network.name}.json`)

async function main() {
  console.log(`Deploying contracts to ${hre.network.name}...`)

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
      abi: require(path.resolve(__dirname, '../artifacts/contracts/YouCollector.sol/YouCollector.json')).abi,
    },
  }

  fs.writeFileSync(contractsSaveLocation, JSON.stringify(contracts, null, 2), 'utf-8')

  console.log('Done.')
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})

module.exports = main
