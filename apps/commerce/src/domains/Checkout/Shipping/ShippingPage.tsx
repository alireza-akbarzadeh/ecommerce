import { CommerceLoading } from '@hasty-bazar-commerce/components'
import RenderInDom from '@hasty-bazar-commerce/components/RenderInDom'
import {
  CreateAddressDialog,
  SmallSummaryCart,
  SummaryCart,
} from '@hasty-bazar-commerce/containers'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { MessageCodesEnums } from '@hasty-bazar-commerce/core/enums'
import useGetUserAddress from '@hasty-bazar-commerce/core/hook/useGetUserAddress'
import { useDeleteWebSaleBasketVoucherMutation } from '@hasty-bazar-commerce/Service-Enhancers/BasketApi.enhanced'
import {
  useGetWebSaleBasketByBundleTypeBasketShippmentInquiryQuery,
  usePutWebSaleBasketShippmentBookMutation,
} from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBButton, HBDialog, HBIcon, openToast } from '@hasty-bazar/core'
import { Grid, Theme, Typography, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import CheckoutPageMessages from '../CheckoutPage.messages'
import {
  BundleList,
  DeliveryAddress,
  ShippingMethods,
  ShippingSkeleton,
  UnableShippingProducts,
} from '../components'
import { useShipping } from './ShippingContext'

const ShippingPage: FC = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const router = useRouter()
  const { formatMessage } = useIntl()
  const { activeAddress, isFetching: addressIsFetching } = useGetUserAddress()
  const [showUnableShippingProducts, setShowUnableShippingProducts] = useState<boolean>(false)
  const [shipmentBookMutation, { isLoading: shipmentBookIsLoading }] =
    usePutWebSaleBasketShippmentBookMutation()

  const [deleteVoucherMutate] = useDeleteWebSaleBasketVoucherMutation()

  const {
    openCreateDialog,
    addNewAddress,
    closeCreateAddressModal,
    shippingMethod,
    shippingSummary,
    setShippingBundle,
    inquiries,
  } = useShipping()

  const {
    data: shippingData,
    refetch,
    isFetching: shippingFetching,
  } = useGetWebSaleBasketByBundleTypeBasketShippmentInquiryQuery(
    {
      ...ApiConstants,
      bundleType: shippingMethod,
    },
    { skip: !activeAddress },
  )

  useEffect(() => {
    if (
      !shippingData?.success &&
      shippingData?.messages?.[0]?.code === MessageCodesEnums.RedirectToBasket
    ) {
      openToast({
        message: formatMessage(CheckoutPageMessages.backToBasketMessage),
        type: 'warning',
        vertical: 'top',
      })
      setTimeout(() => {
        router.push('/basket')
      }, 3000)
    } else {
      if (shippingData?.data) {
        setShippingBundle(shippingData.data)
      }
      if (shippingData?.data?.unableToShipProducts) {
        setShowUnableShippingProducts(!!shippingData.data.unableToShipProducts.length)
      }
    }
  }, [shippingData])

  useEffect(() => {
    refetch()
  }, [activeAddress, shippingMethod])

  useEffect(() => {
    if (shippingSummary?.voucherCode) handleRemoveVoucher(shippingSummary.voucherCode)
  }, [shippingSummary])

  const handleRemoveVoucher = (voucherCode: string) => {
    deleteVoucherMutate({
      ...ApiConstants,
      unAssignVoucherToBasketCommandRequest: {
        voucherCode,
      },
    })
      .unwrap()
      .finally(() => refetch())
  }

  const handleContinueShipping = async () => {
    try {
      const deliveryTimeFrameIds = inquiries?.flatMap((bundle) => {
        const provider = bundle.providers?.find((provider) => provider.isDefault)
        const ids = provider?.deliveryTimes
          ?.map((time) => time.deliveryTimeFrames?.find((item) => item.isDefault)?.id)
          .filter((i) => i) as string[]
        return ids
      })

      const payload = await shipmentBookMutation({
        ...ApiConstants,
        shipmentBookingDto: {
          shipmentOrderId: shippingData?.data?.shipmentOrderId,
          deliveryTimeFrameIds,
        },
      }).unwrap()

      if (payload.success) router.push('/checkout/payment')
    } catch {
      return
    }
  }

  const ShippingSummaryCart: FC = () => {
    return (
      <SummaryCart
        totalAmount={shippingSummary?.totalOriginalAmount ?? 0}
        totalCount={shippingSummary?.totalCount ?? 0}
        totalDiscount={shippingSummary?.totalDiscount ?? 0}
        totalDiscountPercent={shippingSummary?.totalDiscountPercent ?? 0}
        currency={shippingSummary?.currency ?? ''}
        totalShippingFee={shippingSummary?.payableShipmentAmount?.toString()}
        paymentAmount={shippingSummary?.payableAmount?.toString()}
        usedPage="shipping"
        clickedCallBack={handleContinueShipping}
        hideButton={isSmall}
        loading={shipmentBookIsLoading}
      />
    )
  }

  if (addressIsFetching) return <CommerceLoading />
  return (
    <>
      {activeAddress ? (
        <>
          <Grid item container md={8.5} rowGap={{ xs: 2, md: 4 }}>
            <Grid item xs={12}>
              <DeliveryAddress />
            </Grid>
            <Grid item xs={12}>
              <ShippingMethods />
            </Grid>
            <Grid item xs={12}>
              {shippingFetching ? <ShippingSkeleton /> : <BundleList />}
            </Grid>
          </Grid>
          <Grid item xs={12} md={3.5}>
            <ShippingSummaryCart />
          </Grid>
          {showUnableShippingProducts && (
            <UnableShippingProducts
              productsList={shippingData?.data?.unableToShipProducts ?? []}
              onClose={() => setShowUnableShippingProducts(false)}
            />
          )}
        </>
      ) : (
        <HBDialog
          open
          hideCloseButton
          title={formatMessage(CheckoutPageMessages.addNewAddress)}
          content={
            <HBButton
              variant="text"
              sx={{
                mt: 4,
                gap: 2,
                justifyContent: 'flex-start',
                width: 'fit-content',
              }}
              onClick={addNewAddress}
            >
              <HBIcon size="small" type="plusCircle" sx={{ color: 'info.main' }} />
              <Typography sx={{ color: 'info.main' }} variant="h6">
                <FormattedMessage {...CheckoutPageMessages.addAddress} />
              </Typography>
            </HBButton>
          }
        />
      )}

      {openCreateDialog && (
        <CreateAddressDialog open={openCreateDialog} onClose={closeCreateAddressModal} />
      )}
      {isSmall && (
        <RenderInDom containerId="summary-cart">
          <SmallSummaryCart
            usedPage="shipping"
            currency={shippingSummary?.currency ?? ''}
            paymentAmount={shippingSummary?.payableAmount ?? 0}
            clickedCallBack={handleContinueShipping}
            loading={shipmentBookIsLoading}
          />
        </RenderInDom>
      )}
    </>
  )
}

export default ShippingPage
