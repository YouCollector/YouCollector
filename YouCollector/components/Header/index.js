import React, { useContext } from 'react'
import { Box, HStack, Heading, useBreakpointValue } from 'native-base'
import { getHeaderTitle } from '@react-navigation/elements'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import WalletConnector from '../WalletConnector'
import MintButton from '../MintButton'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

function Header({ navigation, route, options, back }) {
  // const blockchainService = useContext(BlockchainServiceContext)
  // const isLargeScreen = useBreakpointValue({
  //   base: false,
  //   md: true,
  // })
  const isLargeScreen = true

  console.log('isLargeScreen', isLargeScreen)

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
        {isLargeScreen ? 'YouCollector' : getHeaderTitle(options, route.name)}
      </Heading>
      <Box flexGrow={1} />
      <WalletConnector />
      {isLargeScreen && (
        <Box ml={true ? 4 : 0}>
          <MintButton />
        </Box>
      )}
    </HStack>
  )
}

export default Header
