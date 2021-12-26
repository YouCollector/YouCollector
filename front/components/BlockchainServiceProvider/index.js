import React, { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

import contracts from '../../contracts/polygon-mumbai.json'

function BlockchainServiceProvider({ children }) {
  const [userAddress, setUserAddress] = useState(null)
  const [transactionCount, setTransactionCount] = useState(null)
  const [blockchainService, setBlockchainService] = useState({ initialized: false })

  const createBlockchainService = useCallback(async () => {
    console.log('Updating blockchain service', userAddress, transactionCount)

    // Init
    const provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : null
    const signer = provider ? provider.getSigner() : null
    const youCollector = new ethers.Contract(contracts.YouCollector.address, contracts.YouCollector.abi, provider)

    let youCollectorSigned = null
    let nextTransactionCount = 0

    console.log('foo')
    if (signer) {
      youCollectorSigned = youCollector.connect(signer)

      if (userAddress && transactionCount === null) {
        console.log('bar')
        nextTransactionCount = await signer.getTransactionCount()
        console.log('bar', nextTransactionCount)

        setTransactionCount(nextTransactionCount)
      }
    }
    console.log('foo')

    async function call(value, functionName, ...args) {
      const signed = typeof value === 'number'

      if (signed && !signer) {
        throw new Error(`${functionName}: signer not available`)
      }

      console.log('calling', functionName, ...args, value)

      let tx = await (signed ? youCollectorSigned : youCollector)[functionName](...args, signed ? { value: ethers.utils.parseEther(value.toString()) } : {})

      if (signed) {
        tx = await tx.wait()

        setTransactionCount(await signer.getTransactionCount())
      }

      return tx
    }

    async function getBalance() {
      if (!userAddress) return null

      const balance = await provider.getBalance(userAddress)

      return fromBigNumber(balance)
    }

    function fromBigNumber(bigNumber) {
      return ethers.utils.formatEther(bigNumber)
    }

    function toBigNumber(number) {
      return ethers.utils.parseEther(number.toString())
    }

    function toNumber(bigNumber) {
      return parseFloat(fromBigNumber(bigNumber))
    }

    console.log('userAddress', userAddress)

    setBlockchainService({
      initialized: true,
      // Blockchain info
      // blockchainId: '0x80001',
      blockchainId: '0x13881',
      blockchainName: 'Polygon Testnet Mumbai',
      blockchainCurrencyName: 'MATIC',
      blockchainCurrencySymbol: 'MATIC',
      blockchainRPCUrls: [
        'https://rpc-mumbai.maticvigil.com', // ! Must be this one?
        // 'https://polygon-mumbai.g.alchemy.com/v2/mt4Sp-MMzfYTdbsn1NncLkQcZohoRK26',
        'https://rpc-mumbai.matic.today',
        'https://matic-mumbai.chainstacklabs.com',
        'https://matic-testnet-archive-rpc.bwarelabs.com',
      ],
      blockchainBlockExplorerUrl: 'https://mumbai.polygonscan.com',
      blockchainIconUrl: 'https://polygon.technology/media-kit/matic-token-icon.png',
      // Metadatas
      zeroAddress: '0x0000000000000000000000000000000000000000',
      // User info
      userAddress,
      transactionCount: nextTransactionCount || transactionCount,
      // blockain objects
      // provider,
      // signer,
      // youCollector,
      // youCollectorSigned,
      // Methods
      call,
      getBalance,
      setUserAddress: x => setUserAddress(x.toLowerCase()),
      // Helpers
      fromBigNumber,
      toBigNumber,
      toNumber,
    })
  }, [userAddress, transactionCount])

  useEffect(createBlockchainService, [createBlockchainService])

  return (
    <BlockchainServiceContext.Provider value={blockchainService}>
      {children}
    </BlockchainServiceContext.Provider>
  )
}

export default BlockchainServiceProvider
