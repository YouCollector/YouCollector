import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Box, Button, Heading, Link, Text, VStack } from 'native-base'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

import YoutubeVideo from '../../components/YoutubeVideo'

function MarketplaceItem({ route, navigation }) {
  const { videoId } = route.params
  const blockchainService = useContext(BlockchainServiceContext)
  const [marketplaceItem, setMarketplaceItem] = React.useState(null)

  const fetchMarketplaceItem = useCallback(async () => {
    if (!blockchainService.initialized) return

    const nextMarketplaceItem = await blockchainService.call(false, 'videoIdToMarketplaceItem', videoId)

    setMarketplaceItem(nextMarketplaceItem)
  }, [blockchainService, videoId])

  useEffect(fetchMarketplaceItem, [fetchMarketplaceItem])

  return (
    <>
      <Heading
        textAlign="center"
        size="3xl"
      >
        Video for sale
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
        Foo
      </Box>
    </>
  )
}

export default MarketplaceItem
