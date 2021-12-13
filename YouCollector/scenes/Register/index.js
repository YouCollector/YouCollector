import React, { useContext, useState } from 'react'
import { Text, View } from 'react-native'
import { Button, Input } from 'native-base'
import getVideoId from 'get-video-id'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

import styles from './styles'

function Register({ navigation }) {
  const blockchainService = useContext(BlockchainServiceContext)
  const [urls, setUrls] = useState([])
  const inputs = []

  // MN
  for (let i = 0; i < 8; i++) {
    inputs.push(
      <Input
        key={i}
        placeholder={`YouTube URL ${i + 1}`}
        onChange={event => handleInputChange(event, i)}
      />
    )
  }

  function handleInputChange(event, index) {
    const newUrls = [...urls]

    newUrls[index] = event.target.value

    setUrls(newUrls)
  }

  async function handleRegisterPress() {
    const videoIds = urls
      .map(url => getVideoId(url))
      .filter(id => id && id.service === 'youtube')
      .map(id => id.id)

    console.log('Loading', videoIds)
    await blockchainService.youCollectorSigned.registerNewUser(videoIds)
    console.log('Done')

    navigation.navigate('User', { address: blockchainService.address })
  }

  return (
    <View style={styles.container}>
      <Text>Register</Text>
      {inputs}
      <Button
        onPress={handleRegisterPress}
      >
        Start Collecting
      </Button>
    </View>
  )
}

export default Register
