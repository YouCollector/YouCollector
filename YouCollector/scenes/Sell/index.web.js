import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Alert, Box, Button, FormControl, Heading, Input, Link, Text } from 'native-base'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

import Container from '../../components/Container'
import YoutubeVideo from '../../components/YoutubeVideo'

function Sell({ navigation, route }) {
  const { videoId } = route.params
  const blockchainService = useContext(BlockchainServiceContext)
  const [owner, setOwner] = useState(null)
  const [marketplaceItem, setMarketplaceItem] = useState(null)
  const [price, setPrice] = useState('')
  const [bid, setBid] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchOwner = useCallback(async () => {
    if (!blockchainService.initialized) return

    const nextOwner = await blockchainService.call(false, 'videoIdToOwner', videoId)

    setOwner(nextOwner.toLowerCase())
  }, [blockchainService, videoId])

  const fetchMarketplaceItem = useCallback(async () => {
    if (!blockchainService.initialized) return

    const nextMarketplaceItem = await blockchainService.call(false, 'videoIdToMarketplaceItem', videoId)

    setMarketplaceItem(nextMarketplaceItem)
  }, [blockchainService, videoId])

  useEffect(fetchOwner, [fetchOwner])
  useEffect(fetchMarketplaceItem, [fetchMarketplaceItem])

  async function handleSubmit() {
    if (!blockchainService.initialized) {
      return setError('Blockchain service is not initialized')
    }

    const parsedPrice = parseFloat(price)

    if (parsedPrice !== parsedPrice) {
      return setError('Invalid direct sale price')
    }

    const parsedBid = parseFloat(bid)

    if (parsedBid !== parsedBid) {
      return setError('Invalid bidding start price')
    }

    if (parsedPrice === 0 && parsedBid === 0) {
      return setError('Direct sale price and bidding start price cannot both be 0')
    }

    if (!date) {
      return setError('Please input a closing date')
    }

    let parsedDate = new Date(date)

    parsedDate.setUTCHours(0, 0, 0, 0)
    parsedDate.setUTCDate(parsedDate.getUTCDate() + 1)

    parsedDate = Math.floor(parsedDate.valueOf() / 1000)

    setIsLoading(true)

    await blockchainService.call(0, 'mintMarketplaceItem', videoId, parsedPrice, parsedBid, parsedDate)

    navigation.navigate('MarketplaceItem', { videoId })
  }

  function renderNotOwner() {
    return (
      <Text
        textAlign="center"
      >
        You are not the owner of this video.
      </Text>
    )
  }

  function renderMarketplaceItem() {
    return (
      <>
        <Text
          textAlign="center"
        >
          This video is already for sale.
        </Text>
        <Link
          marginTop={2}
          onPress={() => navigation.navigate('MarketplaceItem', { videoId })}
        >
          View on Marketplace
        </Link>
      </>
    )
  }

  function renderOwner() {
    return (
      <Box>
        <FormControl>
          <FormControl.Label>
            Direct sale price
          </FormControl.Label>
          <Input
            width={256 + 128 + 64}
            value={price}
            onChangeText={setPrice}
          />
          <FormControl.HelperText>
            Input 0 if you wish to sell only via bidding
          </FormControl.HelperText>
        </FormControl>
        <FormControl>
          <FormControl.Label marginTop={4}>
            Bidding start price
          </FormControl.Label>
          <Input
            width={256 + 128 + 64}
            value={bid}
            onChangeText={setBid}
          />
          <FormControl.HelperText>
            Input 0 if you wish to sell only via direct sale
          </FormControl.HelperText>
        </FormControl>
        <FormControl>
          <FormControl.Label marginTop={4}>
            Closing date
          </FormControl.Label>
          <input
            type="date"
            min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
            value={date}
            onChange={event => console.log(event) || setDate(event.target.value)}
            style={{
              width: 256 + 128 + 64,
            }}
          />
          <FormControl.HelperText>
            Must be at least tomorrow, will occur at midnight UTC
          </FormControl.HelperText>
        </FormControl>
        {!!error && (
          <Alert
            w="100%"
            variant="subtle"
            colorScheme="error"
            status="error"
            marginTop={2}
          >
            {error}
          </Alert>
        )}
        <Button
          marginTop={4}
          onPress={handleSubmit}
          isLoading={isLoading}
          isLoadingText="Minting marketplace item..."
        >
          Sell on Marketplace
        </Button>
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
        marginTop={8}
        alignItems="center"
      >
        {owner && blockchainService.userAddress === owner ? marketplaceItem && marketplaceItem.videoId === videoId ? renderMarketplaceItem() : renderOwner() : renderNotOwner()}
      </Box>
    </Container>
  )
}

export default Sell
