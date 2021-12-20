import React, { useContext } from 'react'
import { Box, Button, HStack, Heading, Input, Link, Pressable, useBreakpointValue } from 'native-base'
import { getHeaderTitle } from '@react-navigation/elements'
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'

import Wallet from '../Wallet'
import MintButton from '../MintButton'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

function Header() {
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
      justifyContent="space-between"
      p="4"
      minHeight="76px"
      borderBottomWidth="1"
      borderBottomColor="gray.200"
      backgroundColor="white"
    >
      <Pressable onPress={() => navigation.navigate('Landing')}>
        <Heading>
          YouCollector
        </Heading>
      </Pressable>
      {isLargeScreen && (
        <HStack alignItems="center">
          <Link
            marginLeft={4}
            isUnderlined={false}
            color="primary.500"
            onPress={() => navigation.navigate('Marketplace')}
          >
            Marketplace
          </Link>
          <Input
            size="lg"
            width={256 + 64 + 16 + 4}
            marginLeft={4}
            placeholder="Search..."
            InputLeftElement={(
              <Box
                color="muted.400"
                marginLeft={2}
              >
                <MaterialIcons
                  name="search"
                  size={16}
                  color="inherit"
                />
              </Box>
            )}
          />
        </HStack>
      )}
      <HStack alignItems="center">
        <Wallet />
        {isLargeScreen && (
          <Box ml={blockchainService.userAddress ? 2 : 0}>
            <MintButton />
          </Box>
        )}
      </HStack>
    </HStack>
  )
}

export default Header
