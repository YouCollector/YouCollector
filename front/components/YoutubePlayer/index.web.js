import React, { useEffect, useRef, useState } from 'react'
import { Box, Spinner } from 'native-base'

function YoutubePlayer({ videoId, width = '100%', onLoad = () => null }) {
  const iframeRef = useRef()
  const [height, setHeight] = useState(400)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!iframeRef.current) return

    setHeight(iframeRef.current.contentWindow?.innerWidth * 9 / 16)
  }, [])

  function handleLoad() {
    setIsReady(true)
    onLoad()
  }

  return (
    <Box
      position="relative"
      width={width}
    >
      {!isReady && (
        <Box
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="lg" />
        </Box>
      )}
      <iframe
        ref={iframeRef}
        onLoad={handleLoad}
        width={width}
        height={height}
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          visibility: isReady ? 'visible' : 'hidden',
        }}
      />
    </Box>
  )
}

export default YoutubePlayer
