import React from 'react'
import { Box, HStack } from 'native-base'

import YoutubePlayer from '../YoutubePlayer'

function VideoLayout({ videoId, children }) {
  return (
    <HStack>
      <Box
        flexGrow={1.618 * 1.618}
      >
        <YoutubePlayer videoId={videoId} />
      </Box>
      <Box
        marginLeft={4}
        flexGrow={1}
      >
        {children}
      </Box>
    </HStack>
  )
}

export default VideoLayout
