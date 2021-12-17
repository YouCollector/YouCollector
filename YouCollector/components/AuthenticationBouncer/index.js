import React, { useContext, useEffect, useState } from 'react'
import { Text, VStack } from 'native-base'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

function AuthenticationBouncer({ children }) {
  const blockchainService = useContext(BlockchainServiceContext)

  if (!blockchainService.userAddress) {
    return (
      <VStack
        flex={1}
        justifyContent="center"
        alignItems="center"
      >
        <Text>You need to be logged into access this.</Text>
      </VStack>
    )
  }

  return children
}

export default AuthenticationBouncer
