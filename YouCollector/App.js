import 'react-native-get-random-values'
import '@ethersproject/shims'

import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NativeBaseProvider, Text } from 'native-base'
import * as Linking from 'expo-linking'

import shortenAddress from './utils/shortenAddress'

import BlockchainServiceProvider from './components/BlockchainServiceProvider'
import Header from './components/Header'

import Landing from './scenes/Landing'
import Register from './scenes/Register'
import User from './scenes/User'
import Mint from './scenes/Mint'

const linking = {
  prefixes: [Linking.createURL('/'), 'https://youcollector.art'],
  config: {
    screens: {
      Landing: '',
      Register: 'register',
      User: '~/:address',
      Mint: 'mint',
    },
  },
}

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <BlockchainServiceProvider>
      <NativeBaseProvider>
        <StatusBar style="auto" />
        <NavigationContainer
          linking={linking}
          fallback={() => (
            <Text>
              Loading...
            </Text>
          )}
        >
          <Stack.Navigator
            initialRouteName="Landing"
            screenOptions={{
              header: Header,
            }}
          >
            <Stack.Screen
              name="Landing"
              component={Landing}
              options={{ title: 'YouCollector' }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ title: 'Sign-up' }}
            />
            <Stack.Screen
              name="User"
              component={User}
              options={({ route }) => ({ title: shortenAddress(route.params.address) })}
            />
            <Stack.Screen
              name="Mint"
              component={Mint}
              options={{ title: 'Mint video' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </BlockchainServiceProvider>
  )
}
