import { HBIcon } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { FC } from 'react'

interface IRateProps {
  value: string
  count?: string
}

const Rate: FC<IRateProps> = (props) => {
  const { count, value } = props
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography variant="caption" color="text.secondary">
        {!!count && `(${count})`}
      </Typography>
      <Typography variant="caption" color="warning.light">
        {!!value && value}
      </Typography>
      <HBIcon sx={{ color: 'warning.light' }} type="star" size="small" />
    </Stack>
  )
}

export default Rate
