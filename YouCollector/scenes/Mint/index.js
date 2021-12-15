import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Box, Button, Input, Text, VStack } from 'native-base'
import getVideoId from 'get-video-id'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

function Mint() {
  const [videoUrl, setVideoUrl] = useState('')
  const [videoIds, setVideoIds] = useState([])
  const [videoIdMinitingPrice, setVideoIdMinitingPrice] = useState(0)
  const blockchainService = useContext(BlockchainServiceContext)

  const isFree = videoIds.length < 8
  const price = isFree ? 0 : videoIdMinitingPrice
  const priceString = isFree ? 'free' : `${blockchainService.weiToEther(videoIdMinitingPrice)} MATIC`

  const getVideoIdMintingPrice = useCallback(async () => {
    if (!blockchainService.initialized) return

    setVideoIdMinitingPrice(await blockchainService.call(false, 'videoIdMintingPrice'))
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

  async function handleSubmit() {
    if (!videoUrl) {
      console.log('videoUrl is empty')

      return
    }

    const { service, id: videoId } = getVideoId(videoUrl)

    console.log('service', service)
    if (service !== 'youtube') {
      console.log('videoUrl is not a youtube video')

      return
    }

    const existingOwner = await blockchainService.call(false, 'videoIdToOwner', videoId)

    console.log('existingOwner', existingOwner)
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

  return (
    <VStack
      backgroundColor="white"
      flex={1}
      p="4"
    >

      <Input
        placeholder="YouTube video URL or Id"
        onChange={event => setVideoUrl(event.target.value)}
      />
      <Button onPress={handleSubmit}>
        {`Mint video (${priceString} + gas fees)`}
      </Button>
      <Text>
        By minting a video you agree to the privacy policy and terms of service.
      </Text>
    </VStack>
  )
}

export default Mint
