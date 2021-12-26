import React, { useContext } from 'react'
import { Button, HStack } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'
import Balance from '../Balance'
import MetamaskButton from '../MetamaskButton'

function Wallet() {
  const blockchainService = useContext(BlockchainServiceContext)
  const navigation = useNavigation()

  if (blockchainService.userAddress) {
    return (
      <HStack>
        <Balance />
        <Button
          marginLeft={4}
          onPress={() => navigation.navigate('User', { address: blockchainService.userAddress })}
          leftIcon={(
            <MaterialIcons
              name="video-collection"
              size={16}
              color="white"
            />
          )}
        >
          My collection
        </Button>
      </HStack>
    )
  }

  return (
    <MetamaskButton />
  )
}

export default Wallet
