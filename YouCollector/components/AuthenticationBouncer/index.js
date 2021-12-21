import React, { useContext } from 'react'
import { Box, Text, VStack } from 'native-base'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

import MetamaskButton from '../MetamaskButton'

function AuthenticationBouncer({ children }) {
  const blockchainService = useContext(BlockchainServiceContext)

  if (!blockchainService.userAddress) {
    return (
      <VStack
        flex={1}
        justifyContent="center"
        alignItems="center"
      >
        <Text>You need to be logged-in to access this.</Text>
        <Box marginTop={4}>
          <MetamaskButton />
        </Box>
      </VStack>
    )
  }

  return children
}

export default AuthenticationBouncer
