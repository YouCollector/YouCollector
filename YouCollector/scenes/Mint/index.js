import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Alert, Box, Button, Input, Text } from 'native-base'
import getVideoId from 'get-video-id'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'
import shortenAddress from '../../utils/shortenAddress'
import YoutubePlayer from '../../components/YoutubePlayer'

function Mint() {
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

    setVideoIdMinitingPrice(parseFloat(blockchainService.parseBigNumber(await blockchainService.call(false, 'videoIdMintingPrice'))))
  }, [blockchainService])

  const getUserVideosIds = useCallback(async () => {
    if (!blockchainService.initialized) return
    if (!blockchainService.userAddress) return

    setVideoIds(await blockchainService.call(false, 'getUserInfo', blockchainService.userAddress))
  }, [blockchainService])

  useEffect(() => {
    getVideoIdMintingPrice()
    getUserVideosIds()
  }, [getVideoIdMintingPrice, getUserVideosIds])

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

    const existingOwner = await blockchainService.call(false, 'videoIdToOwner', videoId)

    setIsLoading(false)

    if (existingOwner !== blockchainService.zeroAddress) {
      setError(`This video has already been minted by ${shortenAddress(existingOwner)}`)

      return
    }

    setIsPreview(true)
  }

  async function handleSubmit() {
    const { service, id: videoId } = getVideoId(videoUrl)

    if (service !== 'youtube') {
      console.log('videoUrl is not a youtube video')

      return
    }

    const existingOwner = await blockchainService.call(false, 'videoIdToOwner', videoId)

    if (existingOwner !== blockchainService.zeroAddress) {
      console.log('Already minted', existingOwner)

      return
    }

    try {
      await blockchainService.call(price, 'mintVideoId', videoId)

      console.log('success')
    }
    catch (error) {
      console.log('error', error.message)
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
    <>
      {isFree && (
        <Text>
          You have used {videoIds.length} of your 8 free video mints.
        </Text>
      )}
      <Text marginTop={1}>
        Enter a YouTube video URL below to add it to your collection. A video cannot belong to more than one collection.
      </Text>
      <Input
        placeholder="YouTube video URL"
        onChange={event => setVideoUrl(event.target.value)}
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
    </>
  )
}

export default Mint
