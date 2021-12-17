import React from 'react'
import { VStack } from 'native-base'

function ApplicationLayout({ children }) {
  return (
    <VStack
      flex={1}
      p="4"
    >
      {children}
    </VStack>
  )
}

export default ApplicationLayout
