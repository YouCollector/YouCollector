import React from 'react'
import { Box } from 'native-base'

import Header from '../Header'

function ApplicationLayout({ children, ...props }) {
  return (
    <>
      <Header {...props} />
      <Box
        flex={1}
        p="4"
      >
        {children}
      </Box>
    </>
  )
}

export default ApplicationLayout
