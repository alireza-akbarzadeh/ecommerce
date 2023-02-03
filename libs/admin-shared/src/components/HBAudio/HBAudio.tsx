import { getFormattedTime } from '@hasty-bazar/admin-shared/utils/util'
import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Box, Slider, Stack, SxProps, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import useAudioPlayer from './useAudioPlayer'

export type HBAudioProps = {
  src: string
  autoPlay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
  preload?: 'auto' | 'metadata' | 'none'
}

const buttonSx: SxProps = {
  minWidth: 40,
  minHeight: 40,
  borderRadius: '50%',
  p: 0,
  pt: 1,
}

export default function HBAudio({ src, autoPlay, controls, loop, muted, preload }: HBAudioProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const { curTime, duration, playing, setPlaying, setClickedTime } = useAudioPlayer({ audioRef })

  const SliderMemo = useCallback(
    () => (
      <Slider
        onChange={(_, value) => setClickedTime(value as number)}
        value={curTime}
        valueLabelDisplay="off"
        color="primary"
        max={duration}
      />
    ),
    [curTime, duration],
  )

  return (
    <Box>
      <audio id="audio" ref={audioRef} controls hidden preload={preload} loop={loop}>
        <source src={src} />
        Your browser does not support the <code>audio</code> element.
      </audio>
      <Box px={20} mb={4}>
        <Stack spacing={4} direction="row" alignItems="center">
          <Typography sx={{ width: 40 }} variant="subtitle1">
            {curTime ? getFormattedTime(curTime!) : ''}
          </Typography>
          <SliderMemo />
          <Typography variant="subtitle1">{duration ? getFormattedTime(duration!) : ''}</Typography>
        </Stack>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" gap={3}>
        <HBButton variant="outlined" sx={buttonSx} onClick={() => setClickedTime(curTime! - 10)}>
          <HBIcon type="forward" size="small" />
        </HBButton>
        <HBButton
          variant="outlined"
          onClick={() => setPlaying(!playing)}
          sx={{ ...buttonSx, minWidth: 50, minHeight: 50 }}
        >
          {playing ? <HBIcon type="pause" /> : <HBIcon type="play" />}
        </HBButton>
        <HBButton variant="outlined" sx={buttonSx} onClick={() => setClickedTime(curTime! + 10)}>
          <HBIcon type="backward" size="small" />
        </HBButton>
      </Box>
    </Box>
  )
}
