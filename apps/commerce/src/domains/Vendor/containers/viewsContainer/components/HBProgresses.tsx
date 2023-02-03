import {
  Box,
  LinearProgress,
  linearProgressClasses,
  LinearProgressProps,
  styled,
  Typography,
} from '@mui/material'
import { FC } from 'react'

type HBProgressesProps = {
  progresses: Array<{ title: string; value: number; props?: LinearProgressProps }>
}

const StyledProgress = styled(LinearProgress)(({ theme }) => ({
  [`&.${linearProgressClasses.root}`]: {
    backgroundColor: theme.palette.grey[200],
    height: 6,
    borderRadius: 10,
  },
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: theme.palette.info.main,
    borderRadius: 10,
  },
}))

const HBProgresses: FC<HBProgressesProps> = ({ progresses }) => {
  return (
    <>
      {progresses
        ?.sort((a, b) => b.value - a.value)
        .map(({ title, value, props }, index) => (
          <Box sx={{ my: 2 }} key={index}>
            <Typography color="text.secondary">{title}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
              <Box sx={{ width: '100%', mr: 2 }}>
                <StyledProgress variant="determinate" value={value} {...props} />
              </Box>
              <Box sx={{ minWidth: 24 }}>
                <Typography variant="body2" color="text.secondary">
                  {value}%
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
    </>
  )
}

export default HBProgresses
