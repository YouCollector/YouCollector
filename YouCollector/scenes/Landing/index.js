import React, { useContext } from 'react'
import { Box, Button, Heading, Text, VStack } from 'native-base'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

function Landing({ navigation }) {
  const blockchainService = useContext(BlockchainServiceContext)

  return (
    <>
      <Heading
        fontSize="9xl"
        textAlign="center"
        marginTop={16}
      >
        Collect and Trade<br />YouTube Videos
      </Heading>
      <Box
        alignItems="center"
        marginTop={16}
      >
        <Button
          size="lg"
          onPress={() => navigation.navigate('Register')}
        >
          <Text
            fontSize="3xl"
            color="white"
          >
            Start collecting

          </Text>
        </Button>
      </Box>
    </>
  )
}

export default Landing
