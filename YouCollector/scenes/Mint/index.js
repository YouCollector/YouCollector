import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Box, Button, Input, Text, VStack } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'
import getVideoId from 'get-video-id'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

function Mint({ navigation, route }) {
  const [videoUrl, setVideoUrl] = useState('')
  const [videoIdMinitingPrice, setVideoIdMinitingPrice] = useState(0)
  const [videoIds, setVideoIds] = useState([])
  const blockchainService = useContext(BlockchainServiceContext)

  const isFree = videoIds.length < 8
  const price = isFree ? 0 : videoIdMinitingPrice
  const priceString = isFree ? 'free' : `${blockchainService.weiToEther(videoIdMinitingPrice)} MATIC`

  const getVideoIdMintingPrice = useCallback(async () => {
    setVideoIdMinitingPrice(await blockchainService.youCollector.videoIdMintingPrice())
  }, [blockchainService])

  const getUserVideosIds = useCallback(async () => {
    if (blockchainService.userAddress) {
      setVideoIds(await blockchainService.youCollector.getUserInfo(blockchainService.userAddress))
    }
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
    <Box
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
    </Box>
  )
}

export default Mint
