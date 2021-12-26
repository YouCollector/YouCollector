import React, { useContext } from 'react'
import { Alert, Box, Button, Heading, Link, Text } from 'native-base'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

function Landing({ navigation }) {
  const blockchainService = useContext(BlockchainServiceContext)

  return (
    <>
      <Box
        alignItems="center"
        marginTop={24}
      >
        <Heading
          fontSize="9xl"
        >
          Collect and Trade
        </Heading>
        <Heading
          fontSize="9xl"
          marginTop={-4}
        >
          YouTube Videos
        </Heading>
        <Text
          fontSize="3xl"
          marginTop={8}
        >
          Powered by the blockchain, designed for art collectors.
        </Text>
        <Button
          size="lg"
          onPress={() => navigation.navigate('Register')}
          marginTop={16}
        >
          <Text
            fontSize="3xl"
            color="white"
          >
            Start collecting
          </Text>
        </Button>
        <Text marginTop={1}>
          or
        </Text>
        <Link
          variant="noColor"
          marginTop={1}
          onPress={() => navigation.navigate('Claim')}
        >
          I'm a Youtuber, claim my videos
        </Link>
        <Alert marginTop={6}>
          This is an alpha version in active development. For inquiries or feedback, please open a discussion on GitHub.
        </Alert>
        <Alert marginTop={6}>
          The alpha version uses the Polygon Mumbai Network blockchain. You can get some MATIC for free at a faucet.
        </Alert>
      </Box>
    </>
  )
}

export default Landing
