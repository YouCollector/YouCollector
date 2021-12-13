import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { Button } from 'native-base'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

import styles from './styles'

function User({ navigation, route }) {
  const [videoIds, setVideoIds] = useState([])
  const blockchainService = useContext(BlockchainServiceContext)

  const getUserVideosIds = useCallback(async () => {
    const videoIds = await blockchainService.youCollector.getUserInfo(route.params.address)

    setVideoIds(videoIds)
  }, [blockchainService, route.params.address])

  useEffect(() => {
    getUserVideosIds()
  }, [getUserVideosIds])

  return (
    <View style={styles.container}>
      <Text>User {route.params.address}</Text>
      <Text>{videoIds}</Text>
    </View>
  )
}

export default User
