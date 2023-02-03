import { CommerceLoading } from '@hasty-bazar-commerce/components'
import RenderInDom from '@hasty-bazar-commerce/components/RenderInDom'
import { SmallSummaryCart, SummaryCart } from '@hasty-bazar-commerce/containers'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { PaymentMethodType } from '@hasty-bazar-commerce/core/enums'
import useClientSession from '@hasty-bazar-commerce/core/hook/useClientSession'
import usePay from '@hasty-bazar-commerce/core/hook/usePay'
import { useGetWebSaleBasketByClientSessionIdBasketQuery } from '@hasty-bazar-commerce/Service-Enhancers/BasketApi.enhanced'
import {
  PaymentMethodDto,
  PaymentProviderDto,
  useGetWebPaymentPaymentMethodQuery,
  useGetWebPaymentWalletBalanceQuery,
} from '@hasty-bazar-commerce/services/paymentApi.generated'
import { BasketItemDto } from '@hasty-bazar-commerce/services/saleApi.generated'
import { openToast } from '@hasty-bazar/core'
import { Grid, Theme, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import CheckoutPageMessages from '../CheckoutPage.messages'
import { DeliveryAddress, OrderByCargo, PaymentMethod, PaymentVoucherCode } from '../components'

interface IGrouped {
  [x: string]: BasketItemDto[]
}
export interface IPaymentCargosData {
  shipmentBundleId?: string | null
  shipmentUserPrice?: number | null
  shipmentDeliveryDate?: Date | null
  shipmentDeliveryFromHour?: string | null
  shipmentDeliveryToHour?: string | null
  currency?: string | null
  list: BasketItemDto[]
}

const PaymentPage: FC = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const clientSessionId = useClientSession()
  const [loading, setLoading] = useState(true)
  const [paymentCargosData, setPaymentCargosData] = useState<IPaymentCargosData[] | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodDto | null>(null)
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<PaymentProviderDto | null>(
    null,
  )

  const { orderPayReq, paymentPayIsLoading } = usePay()

  const { data: paymentMethodsData } = useGetWebPaymentPaymentMethodQuery({
    ...ApiConstants,
  })

  const { data: userWalletBalanceData } = useGetWebPaymentWalletBalanceQuery({
    ...ApiConstants,
  })

  const { data: basketData, refetch } = useGetWebSaleBasketByClientSessionIdBasketQuery(
    {
      ...ApiConstants,
      clientSessionId: clientSessionId!,
    },
    { skip: !clientSessionId },
  )

  useEffect(() => {
    refetch()
  }, [clientSessionId])

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
      const defaultPaymentProvider = paymentMethod?.paymentProviders?.find(
        (provider) => provider.isDefault,
      )
      if (defaultPaymentProvider) setSelectedPaymentProvider(defaultPaymentProvider)
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

  const shoppingCartSummary = useMemo(() => basketData?.data?.shoppingCartSummary, [basketData])

  const groupBy = (arr: any[], property: string): IGrouped => {
    return arr.reduce((memo, x) => {
      if (!memo[x[property]]) {
        memo[x[property]] = []
      }
      memo[x[property]].push(x)
      return memo
    }, {})
  }

  useEffect(() => {
    setLoading(true)
    const bundles = []
    if (!basketData) return

    const allProducts = basketData?.data?.vendors?.flatMap((vendor) => {
      const { vendorName } = vendor
      return vendor.items?.map((item) => {
        return { ...item, vendor: { storeName: vendorName } }
      })
    })

    if (allProducts && allProducts?.every((item) => item?.shipmentBundleId)) {
      const grouped = groupBy(allProducts, 'shipmentBundleId')
      for (const [key, value] of Object.entries(grouped)) {
        const shipmentBundleId = grouped[key]?.find(
          (item) => item?.shipmentBundleId,
        )?.shipmentBundleId
        const shipmentUserPrice = grouped[key]?.find(
          (item) => item?.shipmentUserPrice,
        )?.shipmentUserPrice
        const shipmentDeliveryDate = new Date(
          grouped[key]?.find((item) => item?.shipmentDeliveryDate)?.shipmentDeliveryDate ?? '',
        )
        const shipmentDeliveryFromHour = grouped[key]?.find(
          (item) => item?.shipmentDeliveryFromHour,
        )?.shipmentDeliveryFromHour
        const shipmentDeliveryToHour = grouped[key]?.find(
          (item) => item?.shipmentDeliveryToHour,
        )?.shipmentDeliveryToHour
        const currency = grouped[key]?.find((item) => item?.currency)?.currency

        const myObject = {
          shipmentBundleId,
          shipmentUserPrice,
          shipmentDeliveryDate,
          shipmentDeliveryToHour,
          shipmentDeliveryFromHour,
          currency,
          list: value,
        }
        bundles.push(myObject)
      }
      setPaymentCargosData(
        bundles.sort(
          (a, b) => a?.shipmentDeliveryDate?.getTime() - b?.shipmentDeliveryDate?.getTime(),
        ),
      )
    } else {
      openToast({
        message: formatMessage(CheckoutPageMessages.backToShippingMessage),
        type: 'warning',
        vertical: 'top',
      })
      setTimeout(() => {
        router.push('/checkout/shipping')
      }, 5000)
    }
    setLoading(false)
  }, [basketData])

  const calculatedPayableAmount = useMemo(() => {
    const data = {
      walletAmount: userWalletBalanceData?.data?.value ?? 0,
      payAmount: shoppingCartSummary?.payableAmount ?? 0,
    }
    if (selectedPaymentMethod?.paymentMethodId === `${PaymentMethodType.Wallet}`) {
      if (data.walletAmount >= data.payAmount) {
        return { walletAmount: data.payAmount, payAmount: 0 }
      } else {
        return { ...data, payAmount: data.payAmount - data.walletAmount }
      }
    } else {
      return data
    }
  }, [userWalletBalanceData, selectedPaymentMethod, shoppingCartSummary])

  const PaymentSummaryCart: FC = () => {
    return (
      <SummaryCart
        usedPage="payment"
        totalAmount={shoppingCartSummary?.totalOriginalAmount ?? 0}
        totalCount={shoppingCartSummary?.totalCount ?? 0}
        totalDiscount={shoppingCartSummary?.totalDiscount ?? 0}
        totalDiscountPercent={shoppingCartSummary?.totalDiscountPercent ?? 0}
        currency={shoppingCartSummary?.currency ?? ''}
        totalShippingFee={shoppingCartSummary?.payableShipmentAmount?.toString()}
        voucherCode={shoppingCartSummary?.totalVoucherAmount ?? 0}
        clickedCallBack={() =>
          orderPayReq({
            paymentProviderId: selectedPaymentProvider?.paymentProviderId,
            ...(shoppingCartSummary?.voucherCode && {
              voucher: shoppingCartSummary?.voucherCode,
            }),
          })
        }
        loading={paymentPayIsLoading}
        {...(selectedPaymentMethod?.paymentMethodId === `${PaymentMethodType.Wallet}` && {
          walletAmount: calculatedPayableAmount.walletAmount.toString(),
        })}
        {...(selectedPaymentMethod?.paymentMethodId !== `${PaymentMethodType.Wallet}` && {
          paymentAmount: calculatedPayableAmount.payAmount.toString(),
        })}
        hideButton={isSmall}
      />
    )
  }
  if (loading) return <CommerceLoading />
  return (
    <>
      <Grid item container md={8.5} rowGap={{ xs: 2, md: 4 }}>
        {paymentMethodsData?.data?.paymentMethods && (
          <Grid item xs={12}>
            <PaymentMethod
              content={paymentMethodsData.data.paymentMethods}
              handleChangePaymentMethod={handleChangePaymentMethod}
              handleChangePaymentProvider={handleChangePaymentProvider}
              selectedPaymentMethod={selectedPaymentMethod}
              selectedPaymentProvider={selectedPaymentProvider}
              userWalletBalance={userWalletBalanceData?.data?.value ?? 0}
              currency={userWalletBalanceData?.data?.currencyTitle ?? ''}
              payableAmount={shoppingCartSummary?.payableAmount ?? 0}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <PaymentVoucherCode defaultVoucherCode={shoppingCartSummary?.voucherCode ?? ''} />
        </Grid>
        <Grid item xs={12}>
          <DeliveryAddress readonlyAddress />
        </Grid>
        {!!paymentCargosData?.length && (
          <Grid item xs={12}>
            <OrderByCargo
              cargos={paymentCargosData}
              productsCount={shoppingCartSummary?.totalCount ?? ''}
            />
          </Grid>
        )}
      </Grid>
      <Grid item xs={12} md={3.5}>
        <PaymentSummaryCart />
      </Grid>

      {isSmall && (
        <RenderInDom containerId="summary-cart">
          <SmallSummaryCart
            usedPage="payment"
            clickedCallBack={() =>
              orderPayReq({
                paymentProviderId: selectedPaymentProvider?.paymentProviderId,
                ...(shoppingCartSummary?.voucherCode && {
                  voucher: shoppingCartSummary?.voucherCode,
                }),
              })
            }
            loading={paymentPayIsLoading}
            paymentAmount={
              selectedPaymentMethod?.paymentMethodId === `${PaymentMethodType.Wallet}`
                ? `${calculatedPayableAmount.walletAmount}`
                : `${calculatedPayableAmount.payAmount}`
            }
            currency={shoppingCartSummary?.currency ?? ''}
          />
        </RenderInDom>
      )}
    </>
  )
}

export default PaymentPage
