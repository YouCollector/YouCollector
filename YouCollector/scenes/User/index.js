import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Box, Button, Heading, Text, VStack } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'
import shortenAddress from '../../utils/shortenAddress'
import YoutubePlayer from '../../components/YoutubePlayer'

function User({ navigation, route }) {
  const [videoIds, setVideoIds] = useState([])
  const blockchainService = useContext(BlockchainServiceContext)

  const isViewer = route.params.address === blockchainService.userAddress

  const getUserVideosIds = useCallback(async () => {
    if (!blockchainService.initialized) return

    const nextVideoIds = await blockchainService.call(false, 'getUserInfo', route.params.address)
    console.log('boom', nextVideoIds)

    setVideoIds(nextVideoIds)
  }, [blockchainService, route.params.address])

  useEffect(() => {
    getUserVideosIds()
  }, [getUserVideosIds])

  return (
    <>
      <Heading
        textAlign="center"
        size="3xl"
      >
        Collection
      </Heading>
      <Text
        marginTop={0}
        textAlign="center"
      >
        {route.params.address}
      </Text>
      {isViewer && (
        <Box
          alignItems="center"
          marginTop={4}
        >
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
      <VStack marginTop={4}>
        {videoIds.map(videoId => (
          <Box
            key={videoId}
            marginBottom={4}
          >
            <YoutubePlayer videoId={videoId} />
          </Box>
        ))}
      </VStack>
    </>
  )
}

export default User
