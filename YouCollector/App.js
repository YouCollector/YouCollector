import 'react-native-get-random-values'
import '@ethersproject/shims'

import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NativeBaseProvider, extendTheme } from 'native-base'
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

const theme = extendTheme({
  colors: {
    primary: {
      100: '#FDE2D7',
      200: '#FCBFB0',
      300: '#F79387',
      400: '#F06A68',
      500: '#E63946',
      600: '#C52943',
      700: '#A51C3F',
      800: '#85123A',
      900: '#6E0A36',
    },
    secondary: {
      100: '#CAFDFB',
      200: '#97FAFC',
      300: '#62E9F7',
      400: '#3BD1EF',
      500: '#00AFE5',
      600: '#0088C4',
      700: '#0066A4',
      800: '#004884',
      900: '#00346D',
    },
    success: {
      100: '#F3FBCA',
      200: '#E4F797',
      300: '#CAE860',
      400: '#ABD239',
      500: '#83B505',
      600: '#6C9B03',
      700: '#568202',
      800: '#426801',
      900: '#345600',
    },
    info: {
      100: '#CAFDFB',
      200: '#97FAFC',
      300: '#62E9F7',
      400: '#3BD1EF',
      500: '#00AFE5',
      600: '#0088C4',
      700: '#0066A4',
      800: '#004884',
      900: '#00346D',
    },
    warning: {
      100: '#FDF1CB',
      200: '#FBE099',
      300: '#F4C665',
      400: '#E9AC3F',
      500: '#DB8606',
      600: '#BC6B04',
      700: '#9D5303',
      800: '#7F3D01',
      900: '#692E01',
    },
    error: {
      100: '#FEE5D7',
      200: '#FDC5B0',
      300: '#FB9E88',
      400: '#F7786A',
      500: '#F23D3A',
      600: '#D02A35',
      700: '#AE1D33',
      800: '#8C122F',
      900: '#740B2D',
    },
  },
  components: {
    Text: {
      baseStyle: {
        fontSize: 16,
      },
    },
  },
})

const linking = {
  prefixes: [Linking.createURL('/'), 'https://youcollector.art'],
  config: {
    screens: {
      Landing: '',
      Register: 'register',
      User: '~/:address',
      Mint: 'mint',
      Watch: '-/:videoId',
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
              component={useAuthenticationBouncer(useApplicationLayout(Mint))}
              options={{ title: 'Mint video' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </BlockchainServiceProvider>
  )
}
