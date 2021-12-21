import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Alert, Box, Button, Heading, Input, Link, Text } from 'native-base'
import getVideoId from 'get-video-id'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

import shortenAddress from '../../utils/shortenAddress'

import YoutubePlayer from '../../components/YoutubePlayer'
import Container from '../../components/Container'

function Mint({ navigation }) {
  const [videoUrl, setVideoUrl] = useState('')
  const [videoIds, setVideoIds] = useState([])
  const [videoIdMinitingPrice, setVideoIdMinitingPrice] = useState(0)
  const [isPreview, setIsPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const blockchainService = useContext(BlockchainServiceContext)

  const isFree = videoIds.length < 8
  const price = isFree ? 0 : videoIdMinitingPrice
  const priceString = isFree ? 'free' : `${videoIdMinitingPrice} MATIC`

  const getVideoIdMintingPrice = useCallback(async () => {
    if (!blockchainService.initialized) return

    const nextVideoIdMintingPrice = await blockchainService.call(false, 'videoIdMintingPrice')

    setVideoIdMinitingPrice(blockchainService.toNumber(nextVideoIdMintingPrice))
  }, [blockchainService])

  const getUserVideosIds = useCallback(async () => {
    if (!blockchainService.initialized) return
    if (!blockchainService.userAddress) return

    const nextVideoIds = await blockchainService.call(false, 'getUserInfo', blockchainService.userAddress)

    setVideoIds(nextVideoIds)
  }, [blockchainService])

  useEffect(getVideoIdMintingPrice, [getVideoIdMintingPrice])
  useEffect(getUserVideosIds, [getUserVideosIds])

  async function handlePreview() {
    setError(null)

    if (!videoUrl) {
      setError('Please enter a valid YouTube video URL')

      return
    }

    const { service, id: videoId } = getVideoId(videoUrl)

    if (service !== 'youtube') {
      setError('Please enter a valid YouTube video URL')

      return
    }

    setIsLoading(true)

    const existingOwnerAddress = await blockchainService.call(false, 'videoIdToOwner', videoId)

    setIsLoading(false)

    if (existingOwnerAddress !== blockchainService.zeroAddress) {
      setError(
        <>
          <Text>
            This video has already been minted by
          </Text>
          <Link onPress={() => navigation.navigate('User', { address: existingOwnerAddress })}>
            {shortenAddress(existingOwnerAddress)}
          </Link>
        </>
      )

      return
    }

    setIsPreview(true)
  }

  async function handleSubmit() {
    setIsLoading(true)

    try {
      await blockchainService.call(price, 'mintVideoId', getVideoId(videoUrl).id)

      console.log('success')

      setIsLoading(false)

      navigation.navigate('User', { address: blockchainService.userAddress })
    }
    catch (error) {
      console.log('error', error.message)
      setError(error.message)
    }
  }

  if (!blockchainService.userAddress) {
    return (
      <>
        <Text>You need to be logged in to mint videos</Text>
      </>
    )
  }

  return (
    <Container>
      <Heading
        textAlign="center"
        size="3xl"
      >
        Mint a video
      </Heading>
      {isFree && (
        <Text
          marginTop={4}
          textAlign="center"
        >
          You have used {videoIds.length} of your 8 free video mints.
        </Text>
      )}
      <Text
        marginTop={isFree ? 1 : 4}
        textAlign="center"
      >
        Enter a YouTube video URL below to add it to your collection. Once claimed, it cannot be claimed again.
      </Text>
      <Input
        size="lg"
        placeholder="YouTube video URL"
        onChange={event => setVideoUrl(event.target.value)}
        onSubmitEditing={handlePreview}
        marginTop={4}
      />
      {error && (
        <Alert
          w="100%"
          variant="subtle"
          colorScheme="error"
          status="error"
          marginTop={2}
        >
          <Text>{error}</Text>
        </Alert>
      )}
      {isPreview && (
        <Box marginTop={2}>
          <YoutubePlayer videoId={getVideoId(videoUrl).id} />
        </Box>
      )}
      <Button
        onPress={isPreview ? handleSubmit : handlePreview}
        isLoading={isLoading}
        isLoadingText={isPreview ? 'Minting...' : 'Checking...'}
        marginTop={4}
      >
        {isPreview ? `Mint video (${priceString} + gas fees)` : 'Preview video'}
      </Button>
      <Text marginTop={2}>
        By minting a video you agree to the privacy policy and terms of service.
      </Text>
    </Container>
  )
}

export default Mint
