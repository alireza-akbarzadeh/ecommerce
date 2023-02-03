import { CommerceDetailTransaction } from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Box, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { FC, PropsWithChildren, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import OrderTrackingMessages from '../../orderTracking.messages'
import { OrderTrackingDetailWrappers } from '../../OrderTracking.styles'
import { consignmentStatus, withIcon, withText } from '../ConsignmentStatus'
import OrderHistory from './OrderHistory'

interface IConsignmentHeaderProps {
  status: consignmentStatus
  onClick: () => void
  removeOrderHistory?: boolean
  shoppingCartId: string
  transactions: CommerceDetailTransaction[]
}

const ConsignmentDetailHeader: FC<PropsWithChildren<IConsignmentHeaderProps>> = (props) => {
  const breakpointDownSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { status, onClick, children, removeOrderHistory = false, transactions } = props
  const [openAccordion, setOpenAccordion] = useState<boolean>(false)

  return (
    <OrderTrackingDetailWrappers spacing={6}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant={breakpointDownSm ? 'subtitle2' : 'subtitle1'} color="common.black">
          <FormattedMessage {...OrderTrackingMessages.orderDetail} />
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <HBButton
            onClick={() => onClick()}
            variant="text"
            sx={{ gap: 3, color: 'grey.700', pr: 0 }}
          >
            <Typography variant={breakpointDownSm ? 'body2' : 'button'}>
              <FormattedMessage {...OrderTrackingMessages.back} />
            </Typography>
            <HBIcon type="arrowLeft" />
          </HBButton>
        </Box>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          {withIcon(status)}
          {withText(status, breakpointDownSm)}
        </Stack>
        {!removeOrderHistory && (
          <HBButton
            onClick={() => setOpenAccordion(!openAccordion)}
            variant="outlined"
            sx={{
              gap: 3,
              color: 'grey.700',
              bgcolor: (theme) => `${theme.palette.grey[100]}!important`,
              height: 32,
            }}
          >
            <Typography variant={breakpointDownSm ? 'body2' : 'button'}>
              <FormattedMessage {...OrderTrackingMessages.orderHistory} />
            </Typography>
            <HBIcon
              sx={{
                color: 'gray.700',
                display: 'flex',
                transform: openAccordion ? 'rotate(180deg)' : 'unset',
              }}
              type="angleDown"
            />
          </HBButton>
        )}
      </Stack>

      {!removeOrderHistory && <OrderHistory transactions={transactions} expanded={openAccordion} />}

      {children}
    </OrderTrackingDetailWrappers>
  )
}

export default ConsignmentDetailHeader
