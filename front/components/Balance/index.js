import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Box, HStack, Image, Text } from 'native-base'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

function Balance() {
  const blockchainService = useContext(BlockchainServiceContext)
  const [balance, setBalance] = useState(null)

  const updateBalance = useCallback(async () => {
    const balanceString = await blockchainService.getBalance()
    const [int, dec] = balanceString.split('.')

    setBalance(`${int}.${dec.substring(0, Math.max(4, 7 - int.length))}`)
  }, [blockchainService])

  useEffect(updateBalance, [updateBalance])

  if (balance === null) {
    return (
      <Box
        height="21px"
      />
    )
  }

  return (
    <HStack alignItems="center">
      <Text marginRight="1">{balance}</Text>
      <Image
        source={require('../../assets/matic-token-icon.webp')}
        fadeDuration={0}
        style={{ width: 18, height: 18 }}
        marginTop="2px"
        alt="MATIC"
      />
    </HStack>
  )
}

export default Balance
