import React from 'react'
import { Text, View } from 'react-native'

import WalletConnector from '../WalletConnector'

import styles from './styles'

function ApplicationLayout({ children }) {
  return (
    <>
      <Text>ApplicationLayout</Text>
      <WalletConnector />
      <View style={styles.container}>
        {children}
      </View>
    </>
  )
}

export default ApplicationLayout
