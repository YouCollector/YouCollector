import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { ethers } from 'ethers'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

function Balance() {
  const blockchainService = useContext(BlockchainServiceContext)
  const [balance, setBalance] = useState(0)

  const updateBalance = useCallback(async () => {
    setBalance(await blockchainService.getBalance())
  }, [blockchainService])

  useEffect(updateBalance, [updateBalance, blockchainService.userAddress, blockchainService.transactionCount])

  return (
    <View>
      <Text>Balance: {balance}</Text>
    </View>
  )
}

export default Balance
