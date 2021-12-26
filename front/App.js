import 'react-native-get-random-values'
import '@ethersproject/shims'

import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NativeBaseProvider } from 'native-base'
import * as Linking from 'expo-linking'

import shortenAddress from './utils/shortenAddress'

import BlockchainServiceProvider from './components/BlockchainServiceProvider'
import ApplicationLayout from './components/ApplicationLayout'
import AuthenticationBouncer from './components/AuthenticationBouncer'

import Landing from './scenes/Landing'
import Register from './scenes/Register'
import User from './scenes/User'
import Mint from './scenes/Mint'
import Watch from './scenes/Watch'
import Sell from './scenes/Sell'
import Marketplace from './scenes/Marketplace'
import MarketplaceItem from './scenes/MarketplaceItem'

import theme from './theme'

const linking = {
  prefixes: [Linking.createURL('/'), 'https://youcollector.art'],
  config: {
    screens: {
      Landing: '',
      Register: 'register',
      User: '~/:address',
      Mint: 'mint',
      Watch: '-/:videoId',
      Sell: 'sell/:videoId',
      Marketplace: 'marketplace',
      MarketplaceItem: 'marketplace/:videoId',
    },
  },
}

const Stack = createNativeStackNavigator()

const useApplicationLayout = Component => props => (
  <ApplicationLayout {...props}>
    <Component {...props} />
  </ApplicationLayout>
)

const useAuthenticationBouncer = Component => props => (
  <AuthenticationBouncer>
    <Component {...props} />
  </AuthenticationBouncer>
)

export default function App() {
  return (
    <BlockchainServiceProvider>
      <NativeBaseProvider theme={theme}>
        <StatusBar style="auto" />
        <NavigationContainer linking={linking}>
          <Stack.Navigator
            initialRouteName="Landing"
            screenOptions={{
              header: () => null,
              contentStyle: {
                backgroundColor: '#f9f9f9',
                overflow: 'auto',
              },
            }}
          >
            <Stack.Screen
              name="Landing"
              component={useApplicationLayout(Landing)}
              options={{ title: 'YouCollector' }}
            />
            <Stack.Screen
              name="Watch"
              component={useApplicationLayout(Watch)}
              options={{ title: 'Watch' }}
            />
            <Stack.Screen
              name="Register"
              component={useApplicationLayout(Register)}
              options={{ title: 'Sign-up' }}
            />
            <Stack.Screen
              name="User"
              component={useApplicationLayout(User)}
              options={({ route }) => ({ title: shortenAddress(route.params.address) })}
            />
            <Stack.Screen
              name="Mint"
              component={useApplicationLayout(useAuthenticationBouncer(Mint))}
              options={{ title: 'Mint video' }}
            />
            <Stack.Screen
              name="Sell"
              component={useApplicationLayout(useAuthenticationBouncer(Sell))}
              options={{ title: 'Sell on Marketplace' }}
            />
            <Stack.Screen
              name="Marketplace"
              component={useApplicationLayout(Marketplace)}
              options={{ title: 'Marketplace' }}
            />
            <Stack.Screen
              name="MarketplaceItem"
              component={useApplicationLayout(MarketplaceItem)}
              options={{ title: 'Video for sale' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </BlockchainServiceProvider>
  )
}
