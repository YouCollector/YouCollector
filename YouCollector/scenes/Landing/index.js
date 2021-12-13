import React, { useContext } from 'react'
import { Text, View } from 'react-native'
import { Button } from 'native-base'

import WalletConnector from '../../components/WalletConnector'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

import styles from './styles'

function Landing({ navigation }) {
  const blockchainService = useContext(BlockchainServiceContext)

  return (
    <View style={styles.container}>
      <Text>Landing global</Text>
      <View style={styles.walletContainer}>
        <WalletConnector />
      </View>
      <Button
        onPress={() => navigation.navigate('Register')}
      >
        Sign up
      </Button>
      <Button
        onPress={() => navigation.navigate('User', { address: blockchainService.userAddress })}
      >
        My Collection
      </Button>
    </View>
  )
}

export default Landing
