import { HBIcon } from '@hasty-bazar/core'
import Box from '@mui/material/Box'
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import * as React from 'react'

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number; onComplete?: () => void; showTick?: boolean },
) {
  const { onComplete, showTick, ...other } = props
  const [showCompleteTick, setShowCompleteTick] = React.useState(false)
  React.useEffect(() => {
    if (props.value === 100) {
      if (props.showTick) {
        setShowCompleteTick(true)
        setTimeout(() => {
          onComplete?.()
        }, 1000)
      } else {
        onComplete?.()
      }
    }
  }, [props.value])

  if (showCompleteTick) {
    return (
      <Box
        width={32}
        height={32}
        display="flex"
        sx={{
          borderRadius: '50%',
          bgcolor: 'success.main',
        }}
        alignItems="center"
        justifyContent="center"
      >
        <HBIcon
          type="check"
          sx={{
            color: 'common.white',
          }}
        />
      </Box>
    )
  }

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...other} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  )
}

export default CircularProgressWithLabel
