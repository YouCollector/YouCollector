import React, { useState } from 'react'
import { ethers } from 'ethers'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

function BlockchainServiceProvider({ children }) {
  const [blockchainService, setBlockchainService] = useState(createBlockchainService())

  function createBlockchainService(userAddress = null) {
    console.log('Updating blockchain service', userAddress)

    const provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : null
    const signer = provider ? provider.getSigner() : null
    const contract = null

    function update(...args) {
      setBlockchainService(createBlockchainService(...args))
    }

    return {
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
      userAddress,
      provider,
      signer,
      contract,
      update,
    }
  }

  return (
    <BlockchainServiceContext.Provider value={blockchainService}>
      {children}
    </BlockchainServiceContext.Provider>
  )
}

export default BlockchainServiceProvider
