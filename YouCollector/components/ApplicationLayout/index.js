import React from 'react'
import { VStack } from 'native-base'

import Header from '../Header'

function ApplicationLayout({ children }) {
  return (
    <>
      <Header />
      <VStack
        flex={1}
        p="4"
      >
        {children}
      </VStack>
    </>
  )
}

export default ApplicationLayout
