import React, { useContext, useState } from 'react'
import { Button, Pressable, Text, VStack } from 'native-base'
import { useNavigation } from '@react-navigation/native'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'
import Balance from '../Balance'
import shortenAddress from '../../utils/shortenAddress'

function WalletConnector() {
  const blockchainService = useContext(BlockchainServiceContext)
  const [loading, setLoading] = useState(false)
  const [hasMetamask, setHasMetamask] = useState(true)
  const navigation = useNavigation()

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

    blockchainService.setUserAddress(userAddress)

    setLoading(false)
  }

  if (blockchainService.userAddress) {
    return (
      <Pressable onPress={() => navigation.navigate('User', { address: blockchainService.userAddress })}>
        <VStack alignItems="flex-end">
          <Text>
            {shortenAddress(blockchainService.userAddress)}
          </Text>
          <Balance />
        </VStack>
      </Pressable>
    )
  }

  return (
    <Button
      onPress={handleMetamaskPress}
    >
      Connect to MetaMask
    </Button>
  )
}

export default WalletConnector
