import React, { useState } from 'react'
import { Box } from 'native-base'

import Frame from '../Frame'
import YoutubePlayer from '../YoutubePlayer'

function YoutubeVideo({ videoId, width = 300, frame = false }) {
  const [isLoading, setIsLoading] = useState(frame)

  let node = (
    <Box width={width}>
      <YoutubePlayer
        videoId={videoId}
        width="100%"
        onLoad={() => setIsLoading(false)}
      />
    </Box>
  )

  if (frame) {
    node = (
      <Frame hidden={isLoading}>
        {node}
      </Frame>
    )
  }

  return node
}

export default YoutubeVideo
