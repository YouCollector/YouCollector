import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Box, Heading, Text } from 'native-base'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

import Container from '../../components/Container'
import YoutubeVideo from '../../components/YoutubeVideo'

function Sell({ navigation, route }) {
  const { videoId } = route.params
  const blockchainService = useContext(BlockchainServiceContext)
  const [owner, setOwner] = useState(null)

  const fetchOwner = useCallback(async () => {
    if (!blockchainService.initialized) return

    const nextOwner = await blockchainService.call(false, 'videoIdToOwner', videoId)

    setOwner(nextOwner.toLowerCase())
  }, [blockchainService, videoId])

  useEffect(fetchOwner, [fetchOwner])

  function renderNotOwner() {
    return (
      <Text
        textAlign="center"
        marginTop={4}
      >
        You are not the owner of this video.
      </Text>
    )
  }

  function renderOwner() {
    return (
      null
    )
  }

  return (
    <Container>
      <Heading
        textAlign="center"
        size="3xl"
      >
        Sell a video
      </Heading>
      <Box
        alignItems="center"
        marginTop={4}
      >
        <YoutubeVideo videoId={videoId} />
      </Box>
      {owner && blockchainService.userAddress === owner ? renderOwner() : renderNotOwner()}
    </Container>
  )
}

export default Sell
