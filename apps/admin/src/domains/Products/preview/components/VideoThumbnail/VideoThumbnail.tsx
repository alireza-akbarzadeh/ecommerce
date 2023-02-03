import { HBIcon } from '@hasty-bazar/core'
import { Box, CardMedia, Stack, styled, Typography } from '@mui/material'
import { CSSProperties, FC, useEffect, useRef, useState } from 'react'

interface IVideoThumb {
  src: string
  duration?: string
  width?: CSSProperties['width']
  height?: CSSProperties['height']
}

const VideoCardContainerStyle = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(2),
  width: '100%',
  height: '100%',
  overflow: 'hidden',
}))

const VideoCardStyle = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  zIndex: 1,
  width: 'inherit',
  backgroundColor: theme.palette.common.white,
  opacity: 0.8,
  alignItems: 'center',
  justifyContent: 'center',
}))

const convertSeconds = (sec: number) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s)
}

const VideoThumbnail: FC<IVideoThumb> = ({ src, width = 60, height = 60, duration = '' }) => {
  const [mediaDuration, setMediaDuration] = useState(duration)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current?.addEventListener('loadedmetadata', () => {
        setMediaDuration(convertSeconds(Math.floor(videoRef.current?.duration ?? 0)))
      })
    }
  }, [])

  return (
    <VideoCardContainerStyle>
      <CardMedia
        ref={videoRef}
        component="video"
        style={{
          width,
          height,
          objectFit: 'cover',
          objectPosition: 'center',
        }}
        src={`${process.env.NEXT_PUBLIC_CDN}${src}`}
      />
      <VideoCardStyle direction="row" columnGap={1}>
        {mediaDuration && (
          <Typography variant="caption" color="text.secondary">
            {mediaDuration}
          </Typography>
        )}
        <HBIcon
          type="video"
          size="small"
          sx={{
            color: 'text.secondary',
          }}
        />
      </VideoCardStyle>
    </VideoCardContainerStyle>
  )
}

export default VideoThumbnail
