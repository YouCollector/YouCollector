import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NativeBaseProvider } from 'native-base'

import 'react-native-get-random-values'
import '@ethersproject/shims'

import BlockchainServiceProvider from './components/BlockchainServiceProvider'

import Landing from './scenes/Landing'
import Register from './scenes/Register'
import User from './scenes/User'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <BlockchainServiceProvider>
      <NativeBaseProvider>
        <StatusBar style="auto" />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
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
              options={{ title: 'User' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </BlockchainServiceProvider>
  )
}
