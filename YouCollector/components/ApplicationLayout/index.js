import React from 'react'
import { Linking } from 'react-native'
import { Box, HStack, Pressable, Text } from 'native-base'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import Header from '../Header'
import Container from '../Container'

function ApplicationLayout({ children, ...props }) {
  return (
    <>
      <Header {...props} />
      <Box
        flexGrow={1}
        p="4"
      >
        {children}
      </Box>
      <Container
        paddingTop={12}
        paddingBottom={12}
      >
        <HStack justifyContent="space-between">
          <Text>
            Copyright YouCollector {new Date().getFullYear()}
          </Text>
          <HStack>
            <Pressable
              onPress={() => Linking.openURL('https://github.com/YouCollector/YouCollector')}
            >
              <MaterialCommunityIcons
                name="github"
                size={24}
                color="inherit"
              />
            </Pressable>
          </HStack>
        </HStack>
      </Container>
    </>
  )
}

export default ApplicationLayout
