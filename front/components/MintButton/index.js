import React, { useContext } from 'react'
import { Button } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

function MintButton() {
  const blockchainService = useContext(BlockchainServiceContext)
  const navigation = useNavigation()

  if (!blockchainService.userAddress) {
    return null
  }

  return (
    <Button
      leftIcon={(
        <MaterialIcons
          name="add"
          size={16}
          color="white"
        />
      )}
      onPress={() => navigation.navigate('Mint')}
    >
      Mint a video
    </Button>
  )
}

export default MintButton
