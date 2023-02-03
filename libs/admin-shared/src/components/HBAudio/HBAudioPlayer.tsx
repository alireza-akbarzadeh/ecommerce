import { Box, cardClasses, SxProps } from '@mui/material'
import { AudioCard } from 'material-ui-player'
import { AudioCardProps } from 'material-ui-player/dist/components/AudioCard'
import React from 'react'

export interface AudioPlayerProps extends AudioCardProps {
  sx?: SxProps
}

export default function HBAudioPlayer({ sx, ...props }: AudioPlayerProps) {
  return (
    <Box
      sx={{
        ...sx,
        [`& .${cardClasses.root}`]: {
          boxShadow: 'unset',
        },
      }}
    >
      <AudioCard speed={false} thickness="thin" {...props} />
    </Box>
  )
}
