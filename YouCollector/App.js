import React from 'react'
// import { StyleSheet, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import 'react-native-get-random-values'
import '@ethersproject/shims'

import BlockchainServiceProvider from './components/BlockchainServiceProvider'
import ApplicationLayout from './components/ApplicationLayout'

import Landing from './scenes/Landing'

export default function App() {
  return (
    <BlockchainServiceProvider>
      <ApplicationLayout>
        <Landing />
        <StatusBar style="auto" />
      </ApplicationLayout>
    </BlockchainServiceProvider>
  )
}
