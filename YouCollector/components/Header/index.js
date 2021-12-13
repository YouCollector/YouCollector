import React from 'react'
import { Text } from 'react-native'
import { Box, HStack, Heading } from 'native-base'
import { getHeaderTitle } from '@react-navigation/elements'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import WalletConnector from '../WalletConnector'

function Header({ navigation, route, options, back }) {
  const title = getHeaderTitle(options, route.name)

  return (
    <HStack
      alignItems="center"
      p="4"
      minHeight="76px"
      borderBottomWidth="1"
      borderBottomColor="gray.200"
      backgroundColor="white"
    >
      {!!back && (
        <Box mr="2">
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="black"
            onPress={navigation.goBack}
          />
        </Box>
      )}
      <Heading>
        {title}
      </Heading>
      <Box flexGrow={1} />
      <WalletConnector />
    </HStack>
  )
}

export default Header
