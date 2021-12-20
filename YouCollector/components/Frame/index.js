import React from 'react'
import { StyleSheet } from 'react-native'
import { HStack, Image, VStack } from 'native-base'

const size = 32

// https://codepen.io/chris22smith/pen/PbBwjp
function Frame({ children, hidden = false }) {
  const styles = {
    corner: {
      width: size,
      height: size,
      visibility: hidden ? 'hidden' : 'visible',
    },
    horizontal: {
      resizeMode: 'stretch',
      height: size,
      flexGrow: 1,
      visibility: hidden ? 'hidden' : 'visible',
    },
    vertical: {
      resizeMode: 'stretch',
      width: size,
      flexGrow: 1,
      visibility: hidden ? 'hidden' : 'visible',
    },
  }

  return (
    <VStack>
      <HStack>
        <Image
          source={require('../../assets/frame/frame-top-left.png')}
          style={styles.corner}
        />
        <Image
          source={require('../../assets/frame/frame-top.png')}
          style={styles.horizontal}
        />
        <Image
          source={require('../../assets/frame/frame-top-right.png')}
          style={styles.corner}
        />
      </HStack>
      <HStack>
        <Image
          source={require('../../assets/frame/frame-left.png')}
          style={styles.vertical}
        />
        {children}
        <Image
          source={require('../../assets/frame/frame-right.png')}
          style={styles.vertical}
        />
      </HStack>
      <HStack>
        <Image
          source={require('../../assets/frame/frame-bottom-left.png')}
          style={styles.corner}
        />
        <Image
          source={require('../../assets/frame/frame-bottom.png')}
          style={styles.horizontal}
        />
        <Image
          source={require('../../assets/frame/frame-bottom-right.png')}
          style={styles.corner}
        />
      </HStack>
    </VStack>
  )
}

export default Frame
