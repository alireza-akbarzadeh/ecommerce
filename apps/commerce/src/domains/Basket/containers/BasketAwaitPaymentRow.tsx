import { TextWithHBIcon } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import usePay from '@hasty-bazar-commerce/core/hook/usePay'
import {
  usePostWebSaleOrderCancelMutation,
  WaitingOrderDto,
} from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBButton, HBDialog, HBDivider, openToast } from '@hasty-bazar/core'
import { Box, Grid, Typography } from '@mui/material'
import { FC, useEffect, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import BasketMessages from '../basket.messages'

interface IBasketAwaitPaymentRowProps {
  item: WaitingOrderDto
  timeHasOver: () => void
  cancelCallBack: () => void
}

const BasketAwaitPaymentRow: FC<IBasketAwaitPaymentRowProps> = (props) => {
  const { item, timeHasOver, cancelCallBack } = props
  const [timeLeft, setTimeForLeft] = useState<number>(item?.resevsionMiniuteLeft ?? 0)
  const timeLeftRef = useRef<number>(item?.resevsionMiniuteLeft ?? 0)
  const { formatMessage } = useIntl()
  const { orderRepayReq, paymentPayIsLoading } = usePay()

  const [openCancelConfirmModal, setOpenCancelConfirmModal] = useState<boolean>(false)
  const [
    cancelMutation,
    { isLoading: cancelLoading, isError: cancelationError, data: canceledData },
  ] = usePostWebSaleOrderCancelMutation()
  useEffect(() => {
    const interval = setInterval(() => {
      if (!timeLeftRef.current) {
        timeHasOver()
      } else {
        timeLeftRef.current -= 1
        setTimeForLeft(timeLeftRef.current)
      }
    }, 60000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const handleCancelation = () => {
    cancelMutation({
      ...ApiConstants,
      cancelModel: {
        reason: '',
        orderId: item?.shoppingCartId,
        cancelItems: [],
        //#TODO:after merged sahand-refund-ui read number 1 from cancel enums
        cancelType: 1,
      },
    })
  }

  useEffect(() => {
    if (canceledData?.success) {
      openToast({
        message: formatMessage({ ...BasketMessages.cancelSuccess }),
        type: 'success',
        vertical: 'top',
        horizontal: 'center',
      })
      cancelCallBack()
    }
  }, [canceledData])

  return (
    <Box sx={{ flexGrow: 1, px: { xs: 4, md: 2 } }}>
      <Grid item xs={12}>
        <HBDivider />
      </Grid>
      <Grid
        item
        container
        direction="row"
        justifyContent="space-between"
        rowGap={5}
        columnSpacing={6}
      >
        <Grid item xs={12}>
          <TextWithHBIcon
            customVariant="button"
            textColor="primary.main"
            iconColor="warning.main"
            iconType="exclamationCircle"
            text={<FormattedMessage {...BasketMessages.cancelTime} values={{ time: timeLeft }} />}
          />
        </Grid>
        <Grid
          item
          container
          xs={12}
          md={7}
          columnGap={4}
          rowGap={2}
          alignItems="center"
          justifyContent={{ xs: 'center', sm: 'normal' }}
        >
          <Grid item xs="auto">
            <Typography variant="subtitle1" color="info.main">
              {item?.shoppingCartId}
            </Typography>
          </Grid>
          <Grid item container xs="auto" gap={2}>
            <Typography variant="subtitle1" color="text.secondary">
              <FormattedMessage {...BasketMessages.payable} />
            </Typography>
            <Typography variant="subtitle1" color="text.primary">
              {`${item?.payableAmount?.toLocaleString()} ${item?.currency}`}
            </Typography>
          </Grid>
        </Grid>

        <Grid
          item
          container
          xs={12}
          sm="auto"
          ml="auto"
          gap={2}
          justifyContent={{ xs: 'center', sm: 'flex-end', md: 'normal' }}
        >
          <Grid item>
            <HBButton onClick={() => setOpenCancelConfirmModal(true)} variant="outlined">
              <FormattedMessage {...BasketMessages.cancelOrder} />
            </HBButton>
          </Grid>
          <Grid item>
            <HBButton
              loading={paymentPayIsLoading}
              onClick={() => {
                orderRepayReq({
                  orderId: item.shoppingCartId ?? '',
                })
              }}
            >
              <FormattedMessage {...BasketMessages.pay} />
            </HBButton>
          </Grid>
        </Grid>
      </Grid>

      <HBDialog
        title={formatMessage(BasketMessages.cancelOrder)}
        content={formatMessage(BasketMessages.cancelOrderConfirmation)}
        onAccept={() => handleCancelation()}
        onReject={() => setOpenCancelConfirmModal(false)}
        open={openCancelConfirmModal}
        onClose={() => setOpenCancelConfirmModal(false)}
        acceptBtn={formatMessage(BasketMessages.cancelWord)}
        rejectBtn={formatMessage(BasketMessages.reject)}
        loading={cancelLoading}
      />
    </Box>
  )
}

export default BasketAwaitPaymentRow
