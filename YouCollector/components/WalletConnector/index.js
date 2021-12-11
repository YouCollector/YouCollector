import React, { useContext, useState } from 'react'
import { Text } from 'react-native'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

import styles from './styles'

function WalletConnector() {
  const blockchainService = useContext(BlockchainServiceContext)
  const [loading, setLoading] = useState(false)
  const [hasMetamask, setHasMetamask] = useState(true)

  async function handleMetamaskPress() {
    const hasMetamask = window.ethereum?.isMetaMask

    if (!hasMetamask) {
      setHasMetamask(false)

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

    blockchainService.update(userAddress)

    setLoading(false)
  }

  if (blockchainService.userAddress) {
    return (
      <Text
        style={styles.metamask}
      >
        {blockchainService.userAddress}
      </Text>
    )
  }

  return (
    <Text
      onPress={handleMetamaskPress}
      style={styles.metamask}
    >
      Connect to MetaMask {loading ? '...' : ''} {hasMetamask ? '' : 'Not found'}
    </Text>
  )
}

export default WalletConnector
