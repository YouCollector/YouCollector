import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Box, Button, Heading, Link, Spinner, Text } from 'native-base'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

import VideoLayout from '../../components/VideoLayout'

import shortenAddress from '../../utils/shortenAddress'

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

  console.log('marketplaceItem', marketplaceItem)

  function renderContent() {
    return (
      <>
        <Heading
          size="xl"
        >
          This video is for sale
        </Heading>
        <Text marginTop={2}>
          It belongs to <Link onPress={() => navigation.navigate('User', { address: marketplaceItem.owner })}>{shortenAddress(marketplaceItem.owner)}</Link>.
        </Text>
      </>
    )
  }

  function renderNoContent() {
    return (
      <Spinner />
    )
  }

  return (
    <VideoLayout videoId={videoId}>
      {marketplaceItem ? renderContent() : renderNoContent()}
    </VideoLayout>
  )
}

export default MarketplaceItem
