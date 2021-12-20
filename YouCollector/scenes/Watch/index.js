import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, HStack, Text, useBreakpointValue } from 'native-base'

import YoutubeVideo from '../../components/YoutubeVideo'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'
import shortenAddress from '../../utils/shortenAddress'

function Watch({ navigation, route }) {
  const blockchainService = useContext(BlockchainServiceContext)
  const [ownerAddress, setOwnerAddress] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const { videoId } = route.params
  // TODO create a container component
  const width = useBreakpointValue({
    base: 0,
    sm: 480,
    md: 768,
    lg: 992,
    xl: 1280,
  })

  useEffect(() => {
    if (!blockchainService.initialized) return

    blockchainService.call(false, 'videoIdToOwner', videoId)
    .then(nextOwnerAddress => {
      setOwnerAddress(nextOwnerAddress || null)
      setIsLoading(false)
    })
  }, [videoId, blockchainService])

  return (
    <Box
      width={width}
      marginLeft="auto"
      marginRight="auto"
    >
      <YoutubeVideo
        videoId={videoId}
        width="100%"
      />
      <HStack
        alignItems="center"
        justifyContent="flex-end"
        marginTop={2}
      >
        {isLoading && (
          <Text>Loading...</Text>
        )}
        {!isLoading && (
          <>
            {!!ownerAddress && (
              <>
                <Text>
                  This video has been minted by {shortenAddress(ownerAddress)}
                </Text>
                <Button
                  marginLeft={2}
                  onPress={() => navigation.navigate('User', { address: ownerAddress })}
                >
                  View owner collection
                </Button>
              </>
            )}
            {!ownerAddress && (
              <Button>
                Mint this video
              </Button>
            )}
          </>
        )}
      </HStack>
    </Box>
  )
}

export default Watch
