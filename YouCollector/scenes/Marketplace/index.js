import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Box, Button, Heading, Link, Text, VStack } from 'native-base'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

function Marketplace({ navigation }) {
  const blockchainService = useContext(BlockchainServiceContext)
  const [sort, setSort] = useState(0)
  const [skip, setSkip] = useState(0)
  const [marketplaceItems, setMarketplaceItems] = React.useState([])

  const fetchMarketplaceItems = useCallback(async () => {
    if (!blockchainService.initialized) return

    const nextMarketplaceItems = await blockchainService.call(false, 'getMarketplaceItems', skip, sort)

    setMarketplaceItems(nextMarketplaceItems)
  }, [blockchainService, skip, sort])

  useEffect(fetchMarketplaceItems, [fetchMarketplaceItems])

  return (
    <>
      <Heading
        textAlign="center"
        size="3xl"
      >
        Marketplace
      </Heading>
      <Text>
        {JSON.stringify(marketplaceItems, null, 2)}
      </Text>
    </>
  )
}

export default Marketplace
