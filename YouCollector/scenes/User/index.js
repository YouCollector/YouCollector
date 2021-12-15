import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Box, Button, Text, VStack } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

function User({ navigation, route }) {
  const [videoIds, setVideoIds] = useState([])
  const blockchainService = useContext(BlockchainServiceContext)

  const isViewer = route.params.address === blockchainService.userAddress

  const getUserVideosIds = useCallback(async () => {
    if (!blockchainService.initialized) return

    const videoIds = await blockchainService.call(false, 'getUserInfo', route.params.address)

    setVideoIds(videoIds)
  }, [blockchainService, route.params.address])

  useEffect(() => {
    getUserVideosIds()
  }, [getUserVideosIds])

  return (
    <Box
      backgroundColor="white"
      flex={1}
      p="4"
    >
      {isViewer && (
        <Box alignItems="end">
          <Button
            leftIcon={(
              <MaterialIcons
                name="add"
                size={16}
                color="white"
              />
            )}
            onPress={() => navigation.navigate('Mint')}
          >
            Mint a video
          </Button>
        </Box>
      )}
      <Text>{route.params.address}</Text>
      <VStack>{videoIds}</VStack>
    </Box>
  )
}

export default User
