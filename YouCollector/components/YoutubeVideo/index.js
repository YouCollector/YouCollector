import React from 'react'

import Frame from '../Frame'
import YoutubePlayer from '../YoutubePlayer'

// https://codepen.io/chris22smith/pen/PbBwjp
function YoutubeVideo({ videoId, width = 300 }) {

  return (
    <Frame>
      <YoutubePlayer
        videoId={videoId}
        width={width}
      />
    </Frame>
  )
}

export default YoutubeVideo
