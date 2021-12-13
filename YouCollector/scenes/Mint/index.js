import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Box, Button, Text, VStack } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

function Mint({ navigation, route }) {
  const [videoIdMinitingPrice, setVideoIdMinitingPrice] = useState(0)
  const [videoIds, setVideoIds] = useState([])
  const blockchainService = useContext(BlockchainServiceContext)

  const isFree = videoIds.length < 8
  const price = isFree ? 'free' : `${videoIdMinitingPrice} MATIC`

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

  return (
    <Box
      backgroundColor="white"
      flex={1}
      p="4"
    >
      <Button
        leftIcon={(
          <MaterialIcons
            name="add"
            size={16}
            color="white"
          />
        )}
      >
        {`Mint video (${price} + gas fees)`}
      </Button>
    </Box>
  )
}

export default Mint
