import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { PaymentBusinessEnum, ProviderTypeEnum } from '@hasty-bazar-commerce/core/enums'
import { serverSideRequests } from '@hasty-bazar-commerce/core/utils'
import { PaymentMethod } from '@hasty-bazar-commerce/domains/Checkout/components'
import {
  PaymentMethodDto,
  PaymentPayResult,
  PaymentProviderDto,
  useGetWebPaymentPaymentMethodQuery,
  useGetWebPaymentWalletBalanceQuery,
  usePostWebPaymentPaymentPayMutation,
  usePostWebPaymentPaymentTestMutation,
} from '@hasty-bazar-commerce/services/paymentApi.generated'
import { HBSelectController, HBTextFieldController } from '@hasty-bazar/auth'
import { HBButton, HBForm } from '@hasty-bazar/core'
import { Grid, Stack } from '@mui/material'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const PayTest = () => {
  const router = useRouter()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodDto | null>(null)
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<PaymentProviderDto | null>(
    null,
  )
  const [paymentTestMutation] = usePostWebPaymentPaymentTestMutation()
  const [paymentPayMutation] = usePostWebPaymentPaymentPayMutation()

  const { data: paymentMethodsData } = useGetWebPaymentPaymentMethodQuery({
    ...ApiConstants,
  })

  const { data: userWalletBalanceData } = useGetWebPaymentWalletBalanceQuery({
    ...ApiConstants,
  })

  useEffect(() => {
    const activeMethodId = paymentMethodsData?.data?.paymentMethods?.find(
      (item) => item.isDefault,
    )?.paymentMethodId
    activeMethodId && handleChangePaymentMethod(activeMethodId)
  }, [paymentMethodsData])

  const handleChangePaymentMethod = (paymentMethodId: string) => {
    setSelectedPaymentProvider(null)
    setSelectedPaymentMethod((prev) => {
      const paymentMethod = paymentMethodsData?.data?.paymentMethods?.find(
        (item) => item.paymentMethodId === paymentMethodId,
      )
      const defaultPaymenProvider = paymentMethod?.paymentProviders?.find(
        (provider) => provider.isDefault,
      )
      if (defaultPaymenProvider) setSelectedPaymentProvider(defaultPaymenProvider)
      if (paymentMethod) return paymentMethod
      return prev
    })
  }
  const handleChangePaymentProvider = (paymentProviderId: string) => {
    setSelectedPaymentProvider((prev) => {
      const item = selectedPaymentMethod?.paymentProviders?.find(
        (item) => item.paymentProviderId === paymentProviderId,
      )
      if (item) return item
      return prev
    })
  }

  const runIPG = (path: string, params: { [param: string]: string }, method = 'post') => {
    const form = document.createElement('form') as HTMLFormElement
    form.method = method
    form.action = path
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input')
        hiddenField.type = 'hidden'
        hiddenField.name = key
        hiddenField.value = params[key]
        form.appendChild(hiddenField)
      }
    }
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }

  const handleSelectPaymentTypeFlow = (paymentData: PaymentPayResult, paymentId?: string) => {
    const { providerPayUrl, providerType, token, username, showDetails } = paymentData
    if (showDetails) return router.push(`/payment/result/${paymentId}`)
    switch (providerType) {
      case ProviderTypeEnum.HitWallet:
        return router.push({
          pathname: `/payment/result/${paymentId}`,
        })
      case ProviderTypeEnum.Sep:
        return runIPG(`${providerPayUrl}`, {
          token: token ?? '',
        })
      case ProviderTypeEnum.TaraWallet:
        return runIPG(`${providerPayUrl}`, {
          username: username ?? '',
          token: token ?? '',
        })
      default:
        return providerPayUrl ? router.push(providerPayUrl) : null
    }
  }

  const hamdleSubmitData = async (amount: number, host?: string) => {
    try {
      const payload = await paymentTestMutation({
        ...ApiConstants,
        createPaymentModel: {
          amount,
          paymentMethodId: selectedPaymentMethod?.paymentMethodId,
          paymentProviderId: selectedPaymentProvider?.paymentProviderId,
          paymentBusiness: PaymentBusinessEnum.PayTest,
        },
      }).unwrap()

      if (payload.success && payload.data) {
        const payPayload = await paymentPayMutation({
          ...ApiConstants,
          paymentPayModel: {
            paymentId: payload.data.paymentId,
            ...(host && {
              callbackUrl: `${host}/payment/callback/${selectedPaymentProvider?.paymentProviderId}`,
            }),
          },
        }).unwrap()

        if (payPayload.success && payPayload.data)
          handleSelectPaymentTypeFlow(payPayload.data, payload.data.paymentId)
      }
    } catch (error) {}
  }

  const handleSubmitPaymentId = async (paymentId: string) => {
    router.push(`/payment/result/${paymentId}`)
  }

  return (
    <Grid container p={6} gap={6}>
      <HBButton href="/">home</HBButton>
      <Grid item xs={12}>
        {paymentMethodsData?.data?.paymentMethods && (
          <PaymentMethod
            content={paymentMethodsData.data.paymentMethods}
            handleChangePaymentMethod={handleChangePaymentMethod}
            handleChangePaymentProvider={handleChangePaymentProvider}
            selectedPaymentMethod={selectedPaymentMethod}
            selectedPaymentProvider={selectedPaymentProvider}
            userWalletBalance={userWalletBalanceData?.data?.value ?? 0}
            payableAmount={0}
          />
        )}
      </Grid>

      <Grid item xs={12} sx={{ border: '1px solid', p: 6, borderRadius: 4 }}>
        <HBForm<{ amount: string; host: string }>
          onSubmit={(data) => hamdleSubmitData(+data.amount, data.host)}
        >
          <Grid item container direction="row" gap={6} xs={12}>
            <Grid item xs={4}>
              <HBTextFieldController name="amount" label="مبلغ" type="number" />
            </Grid>
            <Grid item xs>
              <HBSelectController
                name="host"
                label="host"
                formRules={{ required: false }}
                menuItem={[
                  {
                    title: 'http://localhost:4002',
                    value: 'http://localhost:4002',
                  },
                  {
                    title: `https://${process.env.NEXT_PUBLIC_SITE_URL}`,
                    value: `https://${process.env.NEXT_PUBLIC_SITE_URL}`,
                  },
                ]}
              />
            </Grid>
            <HBButton type="submit">پرداخت</HBButton>
          </Grid>
        </HBForm>
      </Grid>

      <Grid item xs={12} md={6} sx={{ border: '1px solid', p: 6, borderRadius: 4 }}>
        <HBForm<{ paymentId: string }> onSubmit={(data) => handleSubmitPaymentId(data.paymentId)}>
          <Stack direction="row" gap={6}>
            <HBTextFieldController name="paymentId" label="پیمنت آیدی" type="number" />
            <HBButton type="submit">مشاهده نتایج</HBButton>
          </Stack>
        </HBForm>
      </Grid>
    </Grid>
  )
}

PayTest.layout = ({ children }: any) => <>{children}</>
export default PayTest

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const { props } = await serverSideRequests(ctx)

//   return { props }
// }
