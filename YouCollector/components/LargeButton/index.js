import React from 'react'
import { Button, Text } from 'native-base'

function LargeButton({ children, ...props }) {
  return (
    <Button
      size="lg"
      {...props}
    >
      <Text
        fontSize="xl"
        color="white"
      >
        {children}
      </Text>
    </Button>
  )
}

export default LargeButton
