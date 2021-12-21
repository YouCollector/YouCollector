import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Box, Button, Heading, Link, Text, VStack } from 'native-base'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

import Container from '../../components/Container'
import YoutubeVideo from '../../components/YoutubeVideo'

function Marketplace({ navigation }) {
  const blockchainService = useContext(BlockchainServiceContext)
  const [sort, setSort] = useState(0)
  const [skip, setSkip] = useState(0)
  const [marketplaceItems, setMarketplaceItems] = React.useState([])

  const fetchMarketplaceItems = useCallback(async () => {
    if (!blockchainService.initialized) return

    const nextMarketplaceItems = await blockchainService.call(false, 'getMarketplaceItems', skip, sort)

    console.log('nextMarketplaceItems', nextMarketplaceItems[0])
    setMarketplaceItems(nextMarketplaceItems)
  }, [blockchainService, skip, sort])

  useEffect(fetchMarketplaceItems, [fetchMarketplaceItems])

  return (
    <Container>
      <Heading
        textAlign="center"
        size="3xl"
      >
        Marketplace
      </Heading>
      <Box
        marginTop={4}
        flexWrap="wrap"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        {marketplaceItems.map(marketplaceItem => (
          <Box key={marketplaceItem.videoId}>
            <YoutubeVideo
              frame
              videoId={marketplaceItem.videoId}
            />
          </Box>
        ))}
      </Box>
    </Container>
  )
}

export default Marketplace
