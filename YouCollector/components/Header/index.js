import React, { useContext } from 'react'
import { Box, HStack, Heading, Pressable, useBreakpointValue } from 'native-base'
import { getHeaderTitle } from '@react-navigation/elements'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import Wallet from '../Wallet'
import MintButton from '../MintButton'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

function Header(props) {
  const blockchainService = useContext(BlockchainServiceContext)
  const navigation = useNavigation()
  const isLargeScreen = useBreakpointValue({
    base: false,
    md: true,
  })

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
      {!!false && (
        <Box mr="2">
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="black"
            onPress={navigation.goBack}
          />
        </Box>
      )}
      <Pressable onPress={isLargeScreen ? () => navigation.navigate('Landing') : null}>
        <Heading>
          {isLargeScreen ? 'YouCollector' : null}
        </Heading>
      </Pressable>
      <Box flexGrow={1} />
      <Wallet />
      {isLargeScreen && (
        <Box ml={blockchainService.userAddress ? 4 : 0}>
          <MintButton />
        </Box>
      )}
    </HStack>
  )
}

export default Header
