import { HBLink } from '@hasty-bazar/admin-shared/components'
import { HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { PaymentStatusEnum, StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import ordersManagementMessage from '@hasty-bazar-admin/domains/OrdersManagement/ordersManagement.message'
import {
  GetOrderBasketQueryResult,
  GetOrderBasketQueryResultApiResult,
  useGetAdminSaleOrderGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils'
import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { OrderWorkFlow } from '../../enums/OrderWorkFlow'
import { PaymentStatus } from '../status'
import { Typo, inlineItem } from './Transaction.Styles'
import TransactionInfo from './TransactionInfo'
const TransactionHistory = ({ data }: GetOrderBasketQueryResultApiResult) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)

  const { formatMessage } = useIntl()
  const {
    paymentStatusName,
    shipmentTotalFee,
    finalPrice,
    partyName,
    orderRegistrarName,
    partyMobile,
    orderPrice,
    paymentMethodName,
    discountPrice,
    partyEconomiccode,
    date,
    orderNumber,
    orderTypesName,
    paidPrice,
    packingFee,
    voucherTotalFee,
    paymentStatusId,
    partyId,
    orderStatusId,
  } = data as GetOrderBasketQueryResult

  return (
    <>
      <Box
        bgcolor="common.white"
        sx={{
          pb: (theme) => theme.spacing(8),
          pt: (theme) => theme.spacing(6),
          px: (theme) => theme.spacing(8),
          borderRadius: (theme) => theme.spacing(5),
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
        }}
      >
        <Stack
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          flexWrap={'wrap'}
          mb={6}
        >
          <Box sx={inlineItem}>
            <HBIcon type={'documentInfo'} />
            <Typography variant="body2">{formatMessage(ordersManagementMessage.orders)}</Typography>
          </Box>
        </Stack>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={inlineItem}>
              <Typography>{formatMessage(ordersManagementMessage.orderCode)}:</Typography>
              <Typography sx={Typo}>{orderNumber}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={inlineItem}>
              <Typography>
                {formatMessage(ordersManagementMessage.orderRegistrationMethod)}:
              </Typography>
              <Typography sx={Typo}>{orderTypesName}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={inlineItem}>
              <Typography>{formatMessage(ordersManagementMessage.orderNameRegister)} :</Typography>
              <Typography sx={Typo}>{orderRegistrarName}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={inlineItem}>
              <Typography>{formatMessage(ordersManagementMessage.nameRealBuyer)}:</Typography>
              <HBLink
                underline={'none'}
                href={`/users/detail/${partyId}`}
                variant={'subtitle2'}
                target="_blank"
                color={'info.main'}
              >
                {partyName}
              </HBLink>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={inlineItem}>
              <Typography>{formatMessage(ordersManagementMessage.phoneNumberBuyer)}:</Typography>
              <Typography sx={Typo}>{partyMobile}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={inlineItem}>
              <Typography>{formatMessage(ordersManagementMessage.purchaseDate)}:</Typography>
              <Typography sx={Typo}>{convertDateToPersian(date as string)}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={inlineItem}>
              <Typography>{formatMessage(ordersManagementMessage.nameLegalBuyer)}:</Typography>
              <Typography sx={Typo}>{'-'}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={inlineItem}>
              <Typography>{formatMessage(ordersManagementMessage.economicNumberBuyer)}:</Typography>
              <Typography sx={Typo}>{partyEconomiccode ? partyEconomiccode : '-'}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={inlineItem}>
              <Typography>{formatMessage(ordersManagementMessage.orderStatus)}:</Typography>
              <Typography sx={Typo}>
                <HBWorkflowState
                  factor={String(OrderWorkFlow.ShoppingCartFactor)}
                  machineCode={StateMachineCode.Order}
                  stateCode={orderStatusId!}
                  useGetStateInfo={useGetStateInfo}
                />
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ borderColor: 'grey.200', my: (theme) => theme.spacing(6.9) }} />
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={inlineItem}>
              <Typography>{formatMessage(ordersManagementMessage.orderAmount)} :</Typography>
              <Typography sx={Typo}>
                {orderPrice ? `${orderPrice?.toLocaleString()} ${defaultCurrencyTitle}` : 0}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={inlineItem}>
              <Typography>{formatMessage(ordersManagementMessage.packagingCost)}:</Typography>
              <Typography sx={Typo}>
                {packingFee ? `${packingFee?.toLocaleString()} ${defaultCurrencyTitle}` : 0}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={inlineItem}>
              <Typography>{formatMessage(ordersManagementMessage.paymentStatus)} :</Typography>
              <Typography sx={Typo}>
                {PaymentStatus({
                  paymentStatusId,
                  paymentStatusName,
                })}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={inlineItem}>
              <Typography>{formatMessage(ordersManagementMessage.totalShippingCost)}:</Typography>
              <Typography sx={Typo}>
                {shipmentTotalFee
                  ? `${shipmentTotalFee?.toLocaleString()} ${defaultCurrencyTitle}`
                  : 0}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={inlineItem}>
              <Typography>{formatMessage(ordersManagementMessage.totalDiscount)}:</Typography>
              <Typography sx={Typo}>
                {discountPrice ? `${discountPrice?.toLocaleString()} ${defaultCurrencyTitle}` : 0}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={inlineItem}>
              <Typography>{formatMessage(ordersManagementMessage.finalPrice)}:</Typography>
              <Typography sx={Typo}>
                {finalPrice ? `${finalPrice?.toLocaleString()} ${defaultCurrencyTitle}` : 0}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={inlineItem}>
              <Typography>{formatMessage(ordersManagementMessage.transactionMethod)}:</Typography>
              <Typography sx={Typo}>{paymentMethodName}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={inlineItem}>
              <Typography>
                {String(paymentStatusId) === String(PaymentStatusEnum.Success)
                  ? formatMessage(ordersManagementMessage.paidPrice)
                  : formatMessage(ordersManagementMessage.payablePrice)}
                :
              </Typography>
              <Typography sx={Typo}>
                {paidPrice ? `${paidPrice?.toLocaleString()} ${defaultCurrencyTitle}` : 0}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={inlineItem}>
              <Typography>{formatMessage(ordersManagementMessage.voucherTotalFee)}:</Typography>
              <Typography sx={Typo}>
                {voucherTotalFee
                  ? `${voucherTotalFee?.toLocaleString()} ${defaultCurrencyTitle}`
                  : 0}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Stack justifyContent={'flex-end'} alignItems={'flex-end'} mt={4}>
          <HBButton onClick={() => setOpenDialog(true)} color="primary">
            <Typography
              component={'span'}
              variant={'body2'}
              sx={{
                color: 'common.white',
              }}
            >
              {formatMessage(ordersManagementMessage.transactionHistory)}
            </Typography>
          </HBButton>
        </Stack>
      </Box>
      {openDialog && <TransactionInfo openDialog={openDialog} setOpenDialog={setOpenDialog} />}
    </>
  )
}

export default TransactionHistory
