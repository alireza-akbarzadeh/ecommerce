import { HBIcon, HBIconType } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { FC } from 'react'

interface IRateChip {
  label: string
  icon?: HBIconType
}
const RateChip: FC<IRateChip> = ({ label, icon }) => {
  return (
    <Stack
      direction="row"
      columnGap={1}
      bgcolor="warning.lighter"
      borderRadius={2}
      px={2}
      alignItems="center"
    >
      <Typography variant="caption" color="warning.main">
        {label}
      </Typography>
      {icon && <HBIcon type={icon} size="small" sx={{ color: 'warning.main' }} />}
    </Stack>
  )
}
export default RateChip
