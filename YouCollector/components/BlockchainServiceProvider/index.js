import React, { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

function BlockchainServiceProvider({ children }) {
  const [blockchainService, setBlockchainService] = useState({})

  const createBlockchainService = useCallback(async (userAddress = null) => {
    console.log('Updating blockchain service', userAddress)

    const provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : null
    const signer = provider ? provider.getSigner() : null
    const contract = null

    async function update(...args) {
      setBlockchainService(await createBlockchainService(...args))
    }

    async function getBalance() {
      if (!userAddress) return null

      const balance = await provider.getBalance(userAddress)

      return ethers.utils.formatEther(balance)
    }

    let transactionCount = 0

    if (signer) {
      transactionCount = await signer.getTransactionCount()
    }

    return {
      // Blockchain info
      // blockchainId: '0x80001',
      blockchainId: '0x13881',
      blockchainName: 'Polygon Testnet Mumbai',
      blockchainCurrencyName: 'MATIC',
      blockchainCurrencySymbol: 'MATIC',
      blockchainRPCUrls: [
        // 'https://polygon-mumbai.g.alchemy.com/v2/mt4Sp-MMzfYTdbsn1NncLkQcZohoRK26',
        'https://matic-mumbai.chainstacklabs.com',
        'https://rpc-mumbai.maticvigil.com',
        'https://matic-testnet-archive-rpc.bwarelabs.com',
      ],
      blockchainBlockExplorerUrl: 'https://mumbai.polygonscan.com',
      blockchainIconUrl: 'https://polygon.technology/media-kit/matic-token-icon.png',
      // User info
      userAddress,
      transactionCount,
      // blockain objects
      provider,
      signer,
      contract,
      // Methods
      getBalance,
      update,
    }
  }, [])

  const initBlockchainService = useCallback(async () => {
    setBlockchainService(await createBlockchainService())
  }, [createBlockchainService])

  useEffect(initBlockchainService, [initBlockchainService])

  return (
    <BlockchainServiceContext.Provider value={blockchainService}>
      {children}
    </BlockchainServiceContext.Provider>
  )
}

export default BlockchainServiceProvider
