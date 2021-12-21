import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Box, FormControl, Heading, Input, Text } from 'native-base'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

import Container from '../../components/Container'
import YoutubeVideo from '../../components/YoutubeVideo'

function Sell({ navigation, route }) {
  const { videoId } = route.params
  const blockchainService = useContext(BlockchainServiceContext)
  const [owner, setOwner] = useState(null)
  const [price, setPrice] = useState('')
  const [bid, setBid] = useState('')

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
      >
        You are not the owner of this video.
      </Text>
    )
  }

  function renderOwner() {
    return (
      <Box>
        <FormControl.Label>
          Direct sale price (input 0 if you wish to sell only via bidding)
        </FormControl.Label>
        <Input
          width={256 + 128}
          value={price}
          onChangeText={setPrice}
        />
        <FormControl.Label marginTop={4}>
          Bidding start price (input 0 if you wish to sell only via direct sale)
        </FormControl.Label>
        <Input
          width={256 + 128}
          value={bid}
          onChangeText={setBid}
        />
        <FormControl.Label marginTop={4}>
          Closing date (must be at least tomorrow)
        </FormControl.Label>
      </Box>
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
      <Box
        marginTop={4}
        alignItems="center"
      >
        {owner && blockchainService.userAddress === owner ? renderOwner() : renderNotOwner()}
      </Box>
    </Container>
  )
}

export default Sell
