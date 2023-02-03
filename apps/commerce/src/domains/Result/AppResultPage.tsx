import { CommerceLoading, HBLink, Nothing } from '@hasty-bazar-commerce/components'
import { PaymentBusinessEnum, PaymentStatusEnum } from '@hasty-bazar-commerce/core/enums'
import { appTokenLocalKey } from '@hasty-bazar-commerce/core/hook/usePay'
import { PaymentDetailsResponse } from '@hasty-bazar-commerce/services/paymentApi.generated'
import { HBButton, HBIcon, HBIconType, openToast } from '@hasty-bazar/core'
import { CircularProgress, Grid, Stack, styled, Typography } from '@mui/material'
import { FC, ReactNode, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import ResultPageMessages from './Result.message'

export const ResultWrapper = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(10),
  marginBottom: theme.spacing(6),
  backgroundColor: theme.palette.common.white,
  maxWidth: theme.breakpoints.values.lg,
  width: '100%',
  borderRadius: theme.spacing(2),
}))

const OrderResultHeader: FC<{ icon: HBIconType; text: ReactNode; color?: string }> = ({
  icon,
  text,
  color = 'inherit',
}) => {
  return (
    <Stack spacing={6} alignItems="center">
      <HBIcon size="large" type={icon} sx={{ color }} />
      <Typography variant="h5" color={color} fontWeight="bold">
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

interface IAppResultPage {
  paymentId: string
}
const AppResultPage: FC<IAppResultPage> = ({ paymentId }) => {
  const { formatMessage } = useIntl()
  const [data, setData] = useState<PaymentDetailsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [callbackLoading, setCallbackLoading] = useState(false)

  const getResultData = () => {
    setLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_APPGATEWAY}/App/Payment/payment/result/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(appTokenLocalKey)}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setData(result?.data)
        else
          openToast({
            message: result?.messages?.[0]?.message,
            type: 'error',
            vertical: 'top',
          })
      })
      .catch()
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (paymentId) {
      return getResultData()
    }
  }, [paymentId])

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
      setCallbackLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_APPGATEWAY}/App/sale/Order/Callback`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(appTokenLocalKey)}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          orderId: data?.paymentBusinessId ?? '',
          paymentId,
        }),
      })
      const result = await res.json()

      if (result?.success && result?.data) return
      else
        openToast({
          message: result?.messages?.[0]?.message,
          type: 'error',
          vertical: 'top',
        })
    } finally {
      setCallbackLoading(false)
    }
  }

  const completeChargeWallet = async () => {
    try {
      setCallbackLoading(true)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APPGATEWAY}/App/Wallet/WalletCharging/${paymentId}/Callback`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(appTokenLocalKey)}`,
            'Content-Type': 'application/json',
          },
          method: 'PUT',
          body: JSON.stringify({
            invoiceId: data?.paymentBusinessId ?? '',
          }),
        },
      )
      const result = await res.json()

      if (result?.success && result?.data) return
      else
        openToast({
          message: result?.messages?.[0]?.message,
          type: 'error',
          vertical: 'top',
        })
    } finally {
      setCallbackLoading(false)
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

  if (loading) return <CommerceLoading />

  return (
    <ResultWrapper container>
      {data && Object.keys(data).length > 0 ? (
        <Stack m="auto" spacing={6} alignItems="center" textAlign="center">
          {data.paymentStatus && (
            <OrderResultHeader
              icon={paymentStatusSelector[+data.paymentStatus].icon}
              color={paymentStatusSelector[+data.paymentStatus].color}
              text={paymentStatusSelector[+data.paymentStatus].text}
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
                  {Number(data?.amount).toLocaleString()} {data?.currnecyTitle}
                </Typography>
              }
            />
          </Stack>

          {(data?.paymentBusiness === PaymentBusinessEnum.Order ||
            data?.paymentBusiness === PaymentBusinessEnum.Wallet) &&
          callbackLoading ? (
            <Stack direction="row" alignItems="center" gap={2}>
              <Typography variant="subtitle1" color="primary.main">
                <FormattedMessage {...ResultPageMessages.transferring} />
              </Typography>
              <CircularProgress size={20} />
            </Stack>
          ) : (
            <HBLink
              underline="none"
              href={`/payment/app/return/${paymentId}/${data.paymentBusiness}/${data.paymentBusinessId}`}
            >
              <HBButton variant="contained">
                <FormattedMessage {...ResultPageMessages.returnToApp} />
              </HBButton>
            </HBLink>
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

export default AppResultPage
