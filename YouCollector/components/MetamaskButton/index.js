import React, { useContext, useState } from 'react'
import { Button } from 'native-base'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

import LargeButton from '../LargeButton'

function MetamaskButton({ large = false, onConnect = () => null }) {
  const blockchainService = useContext(BlockchainServiceContext)
  const [loading, setLoading] = useState(false)

  async function handleMetamaskPress() {
    if (!window.ethereum?.isMetaMask) {
      console.log('redirect to metamask')

      return
    }

    setLoading(true)

    const [userAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' })

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: blockchainService.blockchainId,
          chainName: blockchainService.blockchainName,
          nativeCurrency: {
            name: blockchainService.blockchainCurrencyName,
            symbol: blockchainService.blockchainCurrencySymbol,
            decimals: 18,
          },
          rpcUrls: blockchainService.blockchainRPCUrls,
          blockExplorerUrl: blockchainService.blockchainExplorerUrl,
          iconUrls: [blockchainService.blockchainIconUrl],
        },
      ],
    })

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: blockchainService.blockchainId,
        },
      ],
    })

    blockchainService.setUserAddress(userAddress)

    setLoading(false)

    onConnect()
  }

  const Component = large ? LargeButton : Button

  return (
    <Component
      onPress={handleMetamaskPress}
      isLoading={loading}
      isLoadingText="Trying to connect..."
    >
      Connect to MetaMask
    </Component>
  )
}

export default MetamaskButton
