import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Box, HStack, Heading, Pressable, Tooltip } from 'native-base'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

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
        {marketplaceItems.map(({ videoId }) => (
          <Box
            key={videoId}
            alignItems="flex-end"
          >
            <YoutubeVideo
              frame
              videoId={videoId}
            />
            <HStack
              alignItems="flex-end"
              marginTop={1}
            >
              <Tooltip
                label="Watch"
                placement="top"
              >
                <Pressable
                  color="primary.500"
                  onPress={() => navigation.navigate('Watch', { videoId })}
                >
                  <MaterialCommunityIcons
                    name="eye-outline"
                    size={24}
                    color="inherit"
                  />
                </Pressable>
              </Tooltip>
              <Tooltip
                label="Buy"
                placement="top"
              >
                <Pressable
                  marginLeft={2}
                  color="primary.500"
                  onPress={() => navigation.navigate('MarketplaceItem', { videoId })}
                >
                  <MaterialCommunityIcons
                    name="cart-outline"
                    size={24}
                    color="inherit"
                  />
                </Pressable>
              </Tooltip>
            </HStack>
          </Box>
        ))}
      </Box>
    </Container>
  )
}

export default Marketplace
