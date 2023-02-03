import { usePostWebSaleOrderDeleteOrderCheckInBasketMutation } from '@hasty-bazar-commerce/Service-Enhancers/BasketApi.enhanced'
import {
  PaymentPayResult,
  usePostWebPaymentPaymentPayMutation,
  usePostWebPaymentWalletChargeMutation,
} from '@hasty-bazar-commerce/services/paymentApi.generated'
import {
  usePostWebSaleOrderRepayMutation,
  usePostWebSaleOrderStartMutation,
} from '@hasty-bazar-commerce/services/saleApi.generated'
import { openToast } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { ApiConstants } from '../constants'
import { MessageCodesEnums, ProviderTypeEnum } from '../enums'

interface IOrderPay {
  paymentProviderId?: string
  voucher?: string
}
interface IOrderRepay {
  orderId: string
}
interface IDepositWallet {
  payableAmountInRial: number
}

interface IRunAppPay {
  token: string
  paymentId: string
}

export const appTokenLocalKey = 'app-token'

// user must signedIn for payment, prevent using this method in unSignedIn pages
const usePay = () => {
  const router = useRouter()

  const [orderMutation, { isLoading: orderIsLoading }] = usePostWebSaleOrderStartMutation()

  const [deleteAndRefreshBasketMutation] = usePostWebSaleOrderDeleteOrderCheckInBasketMutation()

  const [orderRepayMutation, { isLoading: orderRepayIsLoading }] =
    usePostWebSaleOrderRepayMutation()

  const [paymentPayMutation, { isLoading: paymentIsLoading }] =
    usePostWebPaymentPaymentPayMutation()

  const paymentPayIsLoading = useMemo(
    () => !!(orderIsLoading || paymentIsLoading || orderRepayIsLoading),
    [orderIsLoading, paymentIsLoading, orderRepayIsLoading],
  )
  const [walletChargingMutation, { isLoading: walletChargingIsLoading }] =
    usePostWebPaymentWalletChargeMutation()

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

  const handleSelectPaymentTypeFlow = (paymentData: PaymentPayResult, resultUrl: string) => {
    const { providerPayUrl, providerType, token, username, showDetails } = paymentData
    if (showDetails) return router.push(resultUrl)
    switch (providerType) {
      case ProviderTypeEnum.HitWallet:
        return router.push(resultUrl)
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

  const runPay = async (paymentId: string, isOrder?: boolean) => {
    try {
      const payPayload = await paymentPayMutation({
        ...ApiConstants,
        paymentPayModel: {
          paymentId,
        },
      }).unwrap()

      if (payPayload.success && payPayload.data)
        handleSelectPaymentTypeFlow(payPayload.data, `/payment/result/${paymentId}`)
    } catch {
      if (isOrder) {
        await deleteAndRefreshBasketMutation({
          ...ApiConstants,
          deleteOrderCheckInBasketModel: {
            paymentId,
          },
        })
      }
    }
  }

  const orderPayReq = async (props: IOrderPay) => {
    try {
      const { paymentProviderId, voucher } = props
      const payload = await orderMutation({
        ...ApiConstants,
        startOrderModel: {
          paymentProviderId,
          voucher,
        },
      }).unwrap()

      if (payload?.success && payload?.data?.paymentId) runPay(payload.data.paymentId, true)
    } catch (error) {
      if (error?.data?.messages?.[0]?.code === MessageCodesEnums.RedirectToBasket) {
        setTimeout(() => {
          router.push('/basket')
        }, 3000)
      }
    }
  }

  const orderRepayReq = async (props: IOrderRepay) => {
    try {
      const { orderId } = props
      const payload = await orderRepayMutation({
        ...ApiConstants,
        repayModel: {
          orderId,
        },
      }).unwrap()

      if (payload?.success && payload?.data?.paymentId) runPay(payload.data.paymentId, true)
    } catch {
      return
    }
  }

  const depositWalletReq = async (props: IDepositWallet) => {
    try {
      const { payableAmountInRial } = props
      const payload = await walletChargingMutation({
        ...ApiConstants,
        chargeModel: {
          amount: payableAmountInRial,
        },
      }).unwrap()

      if (payload && payload.data?.paymentId) runPay(payload.data.paymentId)
    } catch {
      return
    }
  }

  const runAppPay = async ({ token, paymentId }: IRunAppPay) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APPGATEWAY}/App/Payment/payment/Pay`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          paymentId,
        }),
      })
      const result = await res.json()

      if (result?.success && result?.data)
        handleSelectPaymentTypeFlow(result.data, `/payment/app/result/${paymentId}`)
      else
        openToast({
          message: result?.messages?.[0]?.message,
          type: 'error',
          vertical: 'top',
        })
    } catch {
      await fetch(`${process.env.NEXT_PUBLIC_APPGATEWAY}/App/sale/Order/DeleteOrderCheckInBasket`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          paymentId,
        }),
      })
    }
  }

  return {
    runAppPay,
    orderPayReq,
    orderRepayReq,
    depositWalletReq,
    paymentPayIsLoading,
    walletChargingIsLoading,
  }
}

export default usePay
