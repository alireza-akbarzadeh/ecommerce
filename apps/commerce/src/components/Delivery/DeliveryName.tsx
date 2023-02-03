import { HBIcon } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { FC } from 'react'

interface IDeliveryName {
  name: string
}

const DeliveryName: FC<IDeliveryName> = (props) => {
  const { name } = props
  return (
    <Stack
      sx={{
        borderRadius: 2,
        bgcolor: 'info.lighter',
        p: 2,
        width: 'fit-content',
      }}
      direction="row"
      alignItems="center"
      spacing={1}
    >
      <HBIcon sx={{ color: 'info.dark' }} type="truck" />
      <Typography variant="overline" color="info.dark">
        {name}
      </Typography>
    </Stack>
  )
}

export default DeliveryName
