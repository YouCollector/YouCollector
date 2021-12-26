const path = require('path')

const hre = require('hardhat')

const configuration = require('../configuration')[hre.network.name]

const contractsSaveLocation = path.resolve(__dirname, `../YouCollector/contracts/${hre.network.name}.json`)
const contractAddress = require(contractsSaveLocation).YouCollector.address

async function main() {
  console.log('Setting video id minting price...')

  const youCollector = await hre.ethers.getContractAt('YouCollector', contractAddress)

  const currentVideoIdMintingPrice = await youCollector.videoIdMintingPrice()

  if (!currentVideoIdMintingPrice.eq(configuration.videoIdMintingPrice)) {
    const tx = await youCollector.setVideoIdMintingPrice(configuration.videoIdMintingPrice)

    await tx.wait()

    console.log('Set to', hre.ethers.utils.formatEther(configuration.videoIdMintingPrice))
  }

  console.log('Done.')
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})

module.exports = main
