const fs = require('fs')
const path = require('path')

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')

const configuration = require('../configuration')[hre.network.name]

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
      abi: require('../abis/YouCollector.json'),
    },
  }

  fs.writeFileSync(contractsSaveLocation, JSON.stringify(contracts, null, 2), 'utf-8')

  console.log('Contracts data saved to:', contractsSaveLocation)

  const currentVideoIdMintingPrice = await youCollector.videoIdMintingPrice()

  if (currentVideoIdMintingPrice.value !== configuration.videoIdMintingPrice.value) {
    console.log('Setting videoIdMintingPrice...')
    const tx = await youCollector.setVideoIdMintingPrice(configuration.videoIdMintingPrice.value)

    await tx.wait()
  }

  console.log('Done.')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
