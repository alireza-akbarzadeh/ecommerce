import { Stack } from '@mui/material'
import { FC, PropsWithChildren } from 'react'

const OrderTrackingDetailBodyHOC: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Stack
      sx={(theme) => ({
        [theme.breakpoints.down('sm')]: {
          backgroundColor: 'common.white',
        },
      })}
      spacing={4}
    >
      {children}
    </Stack>
  )
}

export default OrderTrackingDetailBodyHOC
