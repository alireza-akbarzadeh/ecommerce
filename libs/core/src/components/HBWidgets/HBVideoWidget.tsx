import { HBButton, HBIconButton } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useRef, useState } from 'react'

export interface HBVideoWidgetProps {
  value?: string | null
  columnIndex: number
  prefixVideoUrl: string
  description?: string
  title?: string
  metaData?: string
}

const HBVideoWidget: FC<HBVideoWidgetProps> = (props) => {
  const { value, description, title, metaData, columnIndex, prefixVideoUrl } = props
  const [showPlayButton, setShowPlayButton] = useState(true)
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const metadata = metaData ? JSON.parse(metaData) : {}

  if (!value) return null

  return (
    <Stack
      px={4}
      py={6}
      bgcolor={'common.white'}
      borderRadius={2}
      direction={{ md: 'row', xs: 'column' }}
      spacing={4}
      maxHeight={350}
    >
      <Box
        sx={{
          position: 'relative',
          width: { md: columnIndex > 25 ? 448 : '100%' },
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <video
          ref={videoRef}
          src={prefixVideoUrl + value}
          width="100%"
          height="100%"
          controls={!showPlayButton}
        />
        {showPlayButton && (
          <>
            <Box
              sx={{
                bgcolor: 'rgba(119, 119, 119, 0.5)',
                width: '100%',
                height: '100%',
                top: 0,
                position: 'absolute',
              }}
            />
            <HBIconButton
              icon="play"
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                color: 'info.main',
              }}
              onClick={() => {
                setShowPlayButton(false)
                videoRef?.current?.play()
              }}
              variant="outlined"
            />
          </>
        )}
      </Box>
      {columnIndex > 25 && (
        <Stack width={{ md: `calc(100% - 472px)` }}>
          <Typography
            mb={6}
            variant="h6"
            color="text.primary"
            sx={{
              minHeight: 24,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </Typography>
          <Box
            component="div"
            sx={{
              '& *': {
                fontFamily: (theme) => `${theme.typography.fontFamily} !important`,
                textAlign: 'justify !important',
                m: 0,
              },
              '& h1,h2,h3,h4,h5': {
                lineHeight: ({ spacing }) => `${spacing(8)} !important`,
              },
              lineHeight: `2.3 !important`,
              maxHeight: 180,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            dangerouslySetInnerHTML={{
              __html: description || '',
            }}
          />
          {metadata?.hasButton && (
            <HBButton
              sx={{ mt: 6, width: 'max-content', ml: 'auto' }}
              onClick={() => router.push(metadata?.button?.link)}
            >
              {metadata?.button?.name}
            </HBButton>
          )}
        </Stack>
      )}
    </Stack>
  )
}

export default HBVideoWidget
