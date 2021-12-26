import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Box, HStack, Heading, Pressable, Text, Tooltip, useBreakpointValue } from 'native-base'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'
import YoutubeVideo from '../../components/YoutubeVideo'
import MintButton from '../../components/MintButton'

const nItemPerRow = 3

function User({ navigation, route }) {
  const [videoIds, setVideoIds] = useState([])
  const blockchainService = useContext(BlockchainServiceContext)

  const isViewer = route.params.address === blockchainService.userAddress
  const isLargeScreen = useBreakpointValue({
    base: false,
    md: true,
  })

  const getUserVideosIds = useCallback(async () => {
    if (!blockchainService.initialized) return

    const nextVideoIds = await blockchainService.call(false, 'getUserInfo', route.params.address)
    console.log('boom', nextVideoIds)

    setVideoIds(nextVideoIds)
  }, [blockchainService, route.params.address])

  function getRows() {
    const items = [...videoIds].reverse()
    const rows = []

    for (let i = 0; i < items.length; i += nItemPerRow) {
      rows.push(items.slice(i, i + nItemPerRow))
    }

    return rows
  }

  useEffect(() => {
    getUserVideosIds()
  }, [getUserVideosIds])

  return (
    <>
      <Heading
        textAlign="center"
        size="3xl"
      >
        Collection
      </Heading>
      <Text
        marginTop={0}
        textAlign="center"
        fontSize="lg"
      >
        {route.params.address}
      </Text>
      {isViewer && !isLargeScreen && (
        <Box
          alignItems="center"
          marginTop={4}
        >
          <MintButton />
        </Box>
      )}
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
      >

        <Box
          marginTop={8}
          justifyContent="flex-start"
          alignItems="flex-start"
          alignContent="flex-start"
          flexShrink={1}
        >
          {getRows().map((row, i) => (
            <Box
              key={i}
              flexDirection="row"
              alignItems="flex-start"
              justifyContent="flex-start"
              flexShrink={1}
            >
              {row.map(videoId => (
                <Box
                  key={videoId}
                  marginBottom={isViewer ? 6 : 12}
                  marginLeft={6}
                  marginRight={6}
                  alignItems="flex-end"
                >
                  <YoutubeVideo
                    frame
                    videoId={videoId}
                  />
                  {isViewer && (
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
                          <MaterialIcons
                            name="play-arrow"
                            size={24}
                            color="inherit"
                          />
                        </Pressable>
                      </Tooltip>
                      <Tooltip
                        label="Sell"
                        placement="top"
                      >
                        <Pressable
                          marginLeft={2}
                          color="primary.500"
                          onPress={() => navigation.navigate('Sell', { videoId })}
                        >
                          <MaterialIcons
                            name="swap-horiz"
                            size={24}
                            color="inherit"
                          />
                        </Pressable>
                      </Tooltip>
                      <Tooltip
                        label="Burn"
                        placement="top"
                      >
                        <Pressable
                          marginLeft={2}
                          color="primary.500"
                          onPress={() => navigation.navigate('Burn', { videoId })}
                        >
                          <MaterialCommunityIcons
                            name="fire"
                            size={24}
                            color="inherit"
                          />
                        </Pressable>
                      </Tooltip>
                    </HStack>
                  )}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </>
  )
}

export default User
