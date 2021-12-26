import React, { useContext, useState } from 'react'
import { Linking } from 'react-native'
import { Box, Button, Heading, Input, Link, Text } from 'native-base'
import getVideoId from 'get-video-id'

import BlockchainServiceContext from '../../contexts/BlockchainServiceContext'

import LargeButton from '../../components/LargeButton'
import MetamaskButton from '../../components/MetamaskButton'
import Container from '../../components/Container'

function Register({ navigation }) {
  // const [step, setStep] = useState('metamask')
  const [step, setStep] = useState(window.ethereum?.isMetaMask ? 'auth' : 'metamask')
  const [isInstallingMetamask, setIsInstallingMetamask] = useState(false)
  const [urls, setUrls] = useState([])
  const blockchainService = useContext(BlockchainServiceContext)
  const inputs = []

  // MN
  for (let i = 0; i < 6; i++) {
    inputs.push(
      <Input
        key={i}
        placeholder={`YouTube URL ${i + 1}`}
        onChange={event => handleInputChange(event, i)}
        marginTop={2}
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

    await blockchainService.call(false, 'registerNewUser', videoIds)

    navigation.navigate('User', { address: blockchainService.userAddress })
  }

  return (
    <Container>
      <Box alignItems="center">
        <Heading
          fontSize="6xl"
          marginTop={16}
        >
          You're about to begin your collecting journey...
        </Heading>
        {step === 'metamask' && (
          <>
            <Heading
              fontSize="4xl"
              color="primary.500"
              marginTop={16}
            >
              YouCollector is based on a blockchain
            </Heading>
            <Text marginTop={4}>
              Yeah, you heard right, just like Bitcoin, but with a twist.
            </Text>
            <Text>
              To connect and collect or trade, you need a cryptocurrency wallet, called Metamask.
            </Text>
            <Text>
              It's a simple program that stores digital currencies for you and keeps them safe.
            </Text>
            <Text marginTop={4}>
              Go for it, it's free.
            </Text>
            {!isInstallingMetamask && (
              <LargeButton
                marginTop={8}
                onPress={() => {
                  setIsInstallingMetamask(true)
                  Linking.openURL('https://metamask.io/')
                }}
              >
                Install the Metamask browser extension
              </LargeButton>

            )}
            {isInstallingMetamask && (
              <LargeButton
                marginTop={8}
                onPress={() => window.location.reload()}
              >
                I have installed Metamask on my browser
              </LargeButton>
            )}
            <Text marginTop={4}>
              or
            </Text>
            <Link
              marginTop={4}
              onPress={() => window.location.reload()}
            >
              I installed it, reload the page
            </Link>
          </>
        )}
        {step === 'auth' && (
          <>
            <Heading
              fontSize="4xl"
              color="primary.500"
              marginTop={16}
            >
              I see you have Metamask installed
            </Heading>
            <Box marginTop={8}>
              <MetamaskButton
                large
                onConnect={() => setStep('buy')}
              />
            </Box>
          </>
        )}
        {step === 'buy' && (
          <>
            <Heading
              fontSize="4xl"
              color="primary.500"
              marginTop={16}
            >
              Time to get serious
            </Heading>
            <Text marginTop={4}>
              In order to use YouCollector, you need to buy a cryptocurrency: MATIC.
            </Text>
            <Text>
              With MATIC in your wallet, you will be able to perform transactions on the blockchain.
            </Text>
            <Text>
              So go ahead and buy some
            </Text>
          </>
        )}
      </Box>
    </Container>
  )
}

export default Register
