const hre = require('hardhat')

module.exports = {
  'polygon-mumbai': {
    videoIdMintingPrice: hre.ethers.BigNumber.from('10000000000000000'), // 0.01 MATIC
  },
  'polygon-mainnet': {
    videoIdMintingPrice: hre.ethers.BigNumber.from('1000000000000000000'), // 1 MATIC
  },
}
