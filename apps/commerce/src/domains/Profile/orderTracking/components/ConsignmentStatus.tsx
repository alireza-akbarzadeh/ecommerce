import { HBIcon, HBIconType } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import OrderTrackingMessages from '../orderTracking.messages'

export type consignmentStatus =
  | 'await-payment'
  | 'paid'
  | 'Delivered'
  | 'returned'
  | 'system-cancel'
  | 'canceled'

const statuses: Record<consignmentStatus, { icon: HBIconType; color: string }> = {
  'await-payment': { icon: 'hourglass', color: 'warning.main' },
  'system-cancel': { icon: 'infoCircle', color: 'error.main' },
  canceled: { icon: 'infoCircle', color: 'error.main' },
  Delivered: { icon: 'check', color: 'info.dark' },
  paid: { icon: 'check', color: 'success.main' },
  returned: { icon: 'times', color: 'warning.main' },
}

export const withIcon = (type: consignmentStatus) => (
  <Stack
    alignItems="center"
    justifyContent="center"
    sx={{ bgcolor: statuses[type].color, borderRadius: '100%', p: 0.25 }}
  >
    <HBIcon
      size="small"
      type={statuses[type].icon}
      sx={{
        color: 'common.white',
        fontSize: 20,
        lineHeight: 0,
        transform: statuses[type].icon === 'infoCircle' ? 'rotate(180deg)' : 'unset',
      }}
    />
  </Stack>
)

export const withText = (type: consignmentStatus, breakpointDownSm?: boolean) => {
  return (
    <Typography variant={breakpointDownSm ? 'subtitle2' : 'subtitle1'} color={statuses[type].color}>
      <FormattedMessage {...OrderTrackingMessages[type]} />
    </Typography>
  )
}
