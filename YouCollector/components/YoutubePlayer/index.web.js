import React, { useEffect, useRef, useState } from 'react'

function YoutubePlayer({ videoId, width = '100%' }) {
  const iframeRef = useRef()
  const [height, setHeight] = useState(400)

  useEffect(() => {
    if (!iframeRef.current) return

    setHeight(iframeRef.current.contentWindow?.innerWidth * 9 / 16)
  }, [])

  return (
    <iframe
      ref={iframeRef}
      width={width}
      height={height}
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  )
}

export default YoutubePlayer
