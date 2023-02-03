import { CommerceLoading, Nothing } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { PaymentBusinessEnum, PaymentStatusEnum } from '@hasty-bazar-commerce/core/enums'
import {
  PaymentDetailsResponse,
  useLazyGetWebPaymentPaymentResultByPaymentIdQuery,
  usePostWebPaymentWalletCallbackMutation,
} from '@hasty-bazar-commerce/services/paymentApi.generated'
import { usePostWebSaleOrderCallbackMutation } from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBIcon, HBIconType } from '@hasty-bazar/core'
import { CircularProgress, Grid, Stack, styled, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, ReactNode, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import ResultPageMessages from './Result.message'

export const ResultWrapper = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(10),
  marginBottom: theme.spacing(6),
  backgroundColor: theme.palette.common.white,
  width: theme.breakpoints.values.lg,
  borderRadius: theme.spacing(2),
}))

const OrderResultHeader: FC<{
  icon: HBIconType
  text: ReactNode
  color?: string
  isOrderSuccess?: boolean
}> = ({ icon, text, isOrderSuccess, color = 'inherit' }) => {
  return (
    <Stack spacing={6} alignItems="center">
      <HBIcon size="large" type={icon} sx={{ color }} />
      <Typography
        variant="h5"
        color={color}
        fontWeight="bold"
        className={isOrderSuccess ? 'success-order' : ''}
      >
        {text}
      </Typography>
    </Stack>
  )
}
const OrderResultDetail: FC<{ label: ReactNode; value: ReactNode }> = ({ value, label }) => {
  return (
    <Stack direction="row" columnGap={2}>
      <Typography variant="subtitle1" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle1">{value}</Typography>
    </Stack>
  )
}

interface IResultPage {
  paymentId: string
}
const ResultPage: FC<IResultPage> = ({ paymentId }) => {
  const TIME = 5000
  const router = useRouter()
  const { formatMessage } = useIntl()
  const [data, setData] = useState<PaymentDetailsResponse | null>(null)

  const [getResultQuery, { isFetching: getResultIsFetching }] =
    useLazyGetWebPaymentPaymentResultByPaymentIdQuery()
  const [orderCallback, { isLoading: orderCallbackIsLoading }] =
    usePostWebSaleOrderCallbackMutation()

  const [chargeWalletCallback, { isLoading: chargeWalletCallbackIsLoading }] =
    usePostWebPaymentWalletCallbackMutation()

  const getResultData = () => {
    getResultQuery({
      ...ApiConstants,
      paymentId,
    })
      .unwrap()
      .then((payload) => {
        if (payload.success && payload.data) setData(payload.data)
      })
  }

  useEffect(() => {
    if (paymentId) {
      return getResultData()
    }
  }, [paymentId])

  const handleRedirectUser = (path: string) => {
    router.push(path)
  }

  const completeCallbackHandler = async () => {
    switch (data?.paymentBusiness) {
      case PaymentBusinessEnum.Order:
        return completeOrderPay()
      case PaymentBusinessEnum.Wallet:
        return completeChargeWallet()
      default:
        break
    }
  }

  useEffect(() => {
    if (
      data?.paymentBusiness === PaymentBusinessEnum.Order ||
      data?.paymentBusiness === PaymentBusinessEnum.Wallet
    )
      completeCallbackHandler()
  }, [data?.paymentBusiness])

  const completeOrderPay = async () => {
    try {
      await orderCallback({
        ...ApiConstants,
        callbackModel: {
          orderId: data?.paymentBusinessId ?? '',
          paymentId,
        },
      }).unwrap()
    } finally {
      setTimeout(() => {
        return handleRedirectUser('/profile/order-tracking/')
      }, TIME)
    }
  }

  const completeChargeWallet = async () => {
    try {
      await chargeWalletCallback({
        ...ApiConstants,
        callBackModel: {
          paymentId,
        },
      }).unwrap()
    } finally {
      setTimeout(() => {
        return handleRedirectUser('/profile/wallet/')
      }, TIME)
    }
  }

  const paymentStatusSelector: Record<number, { icon: HBIconType; color: string; text: string }> = {
    [PaymentStatusEnum.None]: {
      icon: 'exclamationTriangle',
      color: 'warning.main',
      text: formatMessage(ResultPageMessages.nonePayMessage),
    },
    [PaymentStatusEnum.Waiting]: {
      icon: 'exclamationCircle',
      color: 'warning.main',
      text: formatMessage(ResultPageMessages.waitingOrderMessage),
    },
    [PaymentStatusEnum.Success]: {
      icon: 'check',
      color: 'success.main',
      text: formatMessage(ResultPageMessages.successPayMessage),
    },
    [PaymentStatusEnum.Failed]: {
      icon: 'timesCircle',
      color: 'error.main',
      text: formatMessage(ResultPageMessages.failOrderMessage),
    },
    [PaymentStatusEnum.Canceled]: {
      icon: 'exclamationTriangle',
      color: 'error.main',
      text: formatMessage(ResultPageMessages.canceledPayMessage),
    },
  }

  if (getResultIsFetching) return <CommerceLoading />

  return (
    <ResultWrapper container>
      {data && Object.keys(data).length > 0 ? (
        <Stack m="auto" spacing={6} alignItems="center" textAlign="center">
          {data.paymentStatus && (
            <OrderResultHeader
              {...paymentStatusSelector[+data.paymentStatus]}
              isOrderSuccess={
                data?.paymentBusiness === PaymentBusinessEnum.Order &&
                data.paymentStatus === PaymentStatusEnum.Success
              }
            />
          )}

          <Stack spacing={2} alignItems="center">
            {data?.paymentStatus === PaymentStatusEnum.Failed && (
              <Typography variant="subtitle2">
                <FormattedMessage {...ResultPageMessages.failOrderDescription} />
              </Typography>
            )}

            {data?.paymentStatus === PaymentStatusEnum.Success && data?.paymentId && (
              <OrderResultDetail
                value={data.paymentId}
                label={<FormattedMessage {...ResultPageMessages.paymentId} />}
              />
            )}

            <OrderResultDetail
              label={<FormattedMessage {...ResultPageMessages.paymentMethodsTitle} />}
              value={`${data?.paymentMethodName ?? ''} ${data?.paymentProviderName ?? ''}`}
            />

            <OrderResultDetail
              label={<FormattedMessage {...ResultPageMessages.paymentPrice} />}
              value={
                <Typography fontWeight="bold">
                  {Number(data?.amount).toLocaleString()} {data.currnecyTitle}
                </Typography>
              }
            />
          </Stack>

          {(data?.paymentBusiness === PaymentBusinessEnum.Order ||
            data?.paymentBusiness === PaymentBusinessEnum.Wallet) && (
            <Stack direction="row" alignItems="center" gap={2}>
              <Typography variant="subtitle1" color="primary.main">
                <FormattedMessage {...ResultPageMessages.transferring} />
              </Typography>
              <CircularProgress size={20} />
            </Stack>
          )}
        </Stack>
      ) : (
        <Stack m="auto">
          <Nothing />
        </Stack>
      )}
    </ResultWrapper>
  )
}

export default ResultPage
