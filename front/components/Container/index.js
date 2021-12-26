import React from 'react'
import { Box, useBreakpointValue } from 'native-base'

function Container({ children, ...props }) {
  const width = useBreakpointValue({
    base: 0,
    sm: 480,
    md: 768,
    lg: 992,
    xl: 1280,
  })

  return (
    <Box
      width={width}
      marginLeft="auto"
      marginRight="auto"
      {...props}
    >
      {children}
    </Box>
  )
}

export default Container
