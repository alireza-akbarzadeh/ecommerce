import { Box, CircularProgress, LinearProgress, linearProgressClasses, styled } from '@mui/material'
import { FC, useEffect, useState } from 'react'

const BorderLinearProgress = styled(LinearProgress)<{ showingValue: number }>(
  ({ theme, showingValue }) => ({
    height: 16,
    borderRadius: 10,
    width: '100%',
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
    },
    '& .MuiLinearProgress-bar': {
      left: '100%',
      borderRadius: 10,
      color: theme.palette.common.white,
      '&::before': {
        display: 'flex',
        content: `"${showingValue}%"`,
        fontSize: 12,
        marginLeft: theme.spacing(1),
      },
    },
  }),
)

const ProfileProgress: FC<{ value: number }> = ({ value }) => {
  const [color, setColor] = useState<string>('')
  const [innerValue, setInnerValue] = useState<number>(10)
  const [showingValue, setShowingValue] = useState<number>(5)

  useEffect(() => {
    if (value > 5) {
      setInnerValue(value)
      setShowingValue(value)
    } else {
      setInnerValue(10)
      setShowingValue(5)
    }
    if (value < 40) {
      setColor('error.main')
    } else if (value >= 40 && value < 60) {
      setColor('warning.main')
    } else if (value >= 60) {
      setColor('success.main')
    }
  }, [value])

  return (
    <Box sx={{ position: 'relative', width: 141, height: 135 }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: 'grey.300',
          width: '100%!important',
          height: '100%!important',
        }}
        thickness={1}
        value={100}
      />
      <CircularProgress
        variant="determinate"
        disableShrink
        sx={{
          color,
          animationDuration: '550ms',
          position: 'absolute',
          left: 0,
          width: '100%!important',
          height: '100%!important',
        }}
        value={innerValue}
        thickness={1}
      />
    </Box>
  )
}

export default ProfileProgress
