import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { FC, PropsWithChildren } from 'react'
import { FormattedMessage } from 'react-intl'
import OrderTrackingMessages from '../orderTracking.messages'
import { consignmentStatus, withIcon, withText } from './ConsignmentStatus'

interface IConsignmentHeaderProps {
  status: consignmentStatus
  onClick: () => void
}

const ConsignmentHeader: FC<PropsWithChildren<IConsignmentHeaderProps>> = (props) => {
  const { status, onClick, children } = props

  return (
    <Stack spacing={{ xs: 4, sm: 6 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          {withIcon(status)}
          {withText(status)}
        </Stack>
        <HBButton variant="text" onClick={() => onClick()} sx={{ pr: '0!important' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>
              <FormattedMessage {...OrderTrackingMessages.orderDetail} />
            </Typography>
            <HBIcon type="angleLeft" sx={{ color: 'grey.700' }} />
          </Stack>
        </HBButton>
      </Stack>
      {children}
    </Stack>
  )
}

export default ConsignmentHeader
