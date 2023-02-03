import { Divider, SxProps } from '@mui/material'
import { FC } from 'react'

const HBDivider: FC<{ sx?: SxProps }> = ({ sx }) => {
  return <Divider sx={{ borderColor: 'grey.100', ...sx }} />
}

export default HBDivider
