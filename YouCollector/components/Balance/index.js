import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Image } from 'react-native'
import { HStack, Text } from 'native-base'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

function Balance() {
  const blockchainService = useContext(BlockchainServiceContext)
  const [balance, setBalance] = useState(0)

  const updateBalance = useCallback(async () => {
    setBalance(await blockchainService.getBalance())
  }, [blockchainService])

  useEffect(updateBalance, [updateBalance, blockchainService.userAddress, blockchainService.transactionCount])

  return (
    <HStack alignItems="center">
      <Image
        source={require('../../assets/matic-token-icon.webp')}
        fadeDuration={0}
        style={{ width: 24, height: 24 }}
      />
      <Text marginLeft="1">{balance.toFixed(4)}</Text>
    </HStack>
  )
}

export default Balance
