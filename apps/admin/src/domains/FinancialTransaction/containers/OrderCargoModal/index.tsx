import { HBAdminAccordion } from '@hasty-bazar/admin-shared/components'
import {
  ShipmentTrackingDto,
  useGetAdminSaleOrderByOrderIdBasketQuery,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { CircularProgress, Grid, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import CreateAccordinTitle from './CreateAccordinTitle'
import ShipmentInfo from './ShipmentInfo'
import FinancialTransactionMessage from '../../financialTransaction.message'

interface OrderCargoModalProps {
  orderId: string
}

const OrderCargoModal: FC<OrderCargoModalProps> = ({ orderId }) => {
  const { formatMessage } = useIntl()
  const { data: vendorsShipmentData, isLoading } = useGetAdminSaleOrderByOrderIdBasketQuery(
    {
      'client-name': 'admin',
      'client-version': '1.0.0',
      orderId: orderId!,
    },
    { skip: !orderId },
  )
  return (
    <Grid container>
      {isLoading ? (
        <Grid item xs={12} display="flex" justifyContent="center">
          <CircularProgress color="secondary" size={20} />
        </Grid>
      ) : !vendorsShipmentData?.data?.shipmentTrackings?.length ? (
        <Grid item xs={12}>
          <Typography variant="body2" color={'grey.500'}>
            {formatMessage(FinancialTransactionMessage.thereIsNoData)}
          </Typography>
        </Grid>
      ) : (
        vendorsShipmentData?.data?.shipmentTrackings?.map((item: ShipmentTrackingDto) => (
          <HBAdminAccordion
            expanded
            title={<CreateAccordinTitle {...{ item }} />}
            hidden
            sx={{ display: 'block' }}
            headerStyle={{ width: '100%' }}
          >
            <ShipmentInfo
              shipmentTrackings={item}
              agentName={vendorsShipmentData?.data?.agentName!}
            />
          </HBAdminAccordion>
        ))
      )}
    </Grid>
  )
}

export default OrderCargoModal
