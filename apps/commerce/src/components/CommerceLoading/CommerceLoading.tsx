import {
  Backdrop,
  Box,
  CircularProgress,
  circularProgressClasses,
  CircularProgressProps,
} from '@mui/material'
import { FC } from 'react'

const CommerceLoading: FC<CircularProgressProps> = (props) => {
  return (
    <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.drawer }}>
      <Box>
        <CircularProgress
          variant="indeterminate"
          disableShrink
          color="warning"
          sx={{
            '-webkit-mask-image':
              'linear-gradient(to right, rgba(255,255,255,0)0%, rgba(255,255,255,1)100%)',
            'mask-image':
              'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
            animationDuration: '750ms',
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: 'round',
            },
          }}
          size={60}
          thickness={5}
          value={100}
          {...props}
        />
      </Box>
    </Backdrop>
  )
}
export default CommerceLoading
