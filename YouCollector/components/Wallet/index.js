import React, { useContext } from 'react'
import { Pressable, Text, VStack } from 'native-base'
import { useNavigation } from '@react-navigation/native'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'
import Balance from '../Balance'
import MetamaskButton from '../MetamaskButton'
import shortenAddress from '../../utils/shortenAddress'

function Wallet() {
  const blockchainService = useContext(BlockchainServiceContext)
  const navigation = useNavigation()

  if (blockchainService.userAddress) {
    return (
      <Pressable
        onPress={() => navigation.navigate('User', { address: blockchainService.userAddress })}
        marginTop={-1}
        marginBottom={-1}
      >
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
    <MetamaskButton />
  )
}

export default Wallet
