import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Button, HStack, Text } from 'native-base'

import YoutubeVideo from '../../components/YoutubeVideo'
import Container from '../../components/Container'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'
import shortenAddress from '../../utils/shortenAddress'

function Watch({ navigation, route }) {
  const blockchainService = useContext(BlockchainServiceContext)
  const [ownerAddress, setOwnerAddress] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const { videoId } = route.params

  const fetchOwnerAddress = useCallback(async () => {
    if (!blockchainService.initialized) return

    setIsLoading(true)

    const nextOwnerAddress = await blockchainService.call(false, 'videoIdToOwner', videoId)

    setOwnerAddress(nextOwnerAddress ? nextOwnerAddress.toLowerCase() : null)
    setIsLoading(false)
  }, [videoId, blockchainService])

  useEffect(fetchOwnerAddress, [fetchOwnerAddress])

  return (
    <Container>
      <YoutubeVideo
        videoId={videoId}
        width="100%"
      />
      <HStack
        alignItems="center"
        justifyContent="flex-end"
        marginTop={2}
      >
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
    </Container>
  )
}

export default Watch
