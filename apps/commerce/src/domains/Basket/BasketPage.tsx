import { FakeSuspense } from '@hasty-bazar-commerce/components'
import RenderInDom from '@hasty-bazar-commerce/components/RenderInDom'
import {
  NationalCodeValidationModal,
  SmallSummaryCart,
  SummaryCart,
} from '@hasty-bazar-commerce/containers'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import useClientSession from '@hasty-bazar-commerce/core/hook/useClientSession'
import useNationalCodeValidator from '@hasty-bazar-commerce/core/hook/useNationalCodeValidator'
import { useGetWebSaleBasketByClientSessionIdBasketQuery } from '@hasty-bazar-commerce/Service-Enhancers/BasketApi.enhanced'
import {
  NotificationDto,
  useLazyGetWebSaleOrdersWaitingQuery,
  WaitingOrderDto,
} from '@hasty-bazar-commerce/services/saleApi.generated'
import { BasketNotificationSubjectFuncs } from '@hasty-bazar-commerce/subjects/BasketNotificationSubject'
import { Box, Grid, Stack, Theme, useMediaQuery } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo, useState } from 'react'
import SignInModal from '../Auth/AuthPage/containers/SignInModal'
import { BasketHeader, EmptyCart } from './components'
import { BasketFovorites, ByVendor } from './containers'
import BasketAwaitPayment from './containers/BasketAwaitPayment'

const BasketPage: FC = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { push } = useRouter()
  const { data } = useSession()
  const clientSessionId = useClientSession()
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [showNationalCodeValidator, setShowNationalCodeValidator] = useState(false)
  const [awaitPaymentOrders, setAwaitPaymentOrders] = useState<WaitingOrderDto[]>([])
  const [functionalNotification, setFunctionalNotification] = useState<NotificationDto[]>([])

  const [getCurrentQuery, { data: currentData }] = useLazyGetWebSaleOrdersWaitingQuery()

  const { data: basketData, refetch } = useGetWebSaleBasketByClientSessionIdBasketQuery(
    {
      ...ApiConstants,
      clientSessionId: clientSessionId!,
    },
    { skip: !clientSessionId },
  )

  const { handleCheckNationalCode, isLoading } = useNationalCodeValidator({
    onValid: () => push('/checkout/shipping'),
    onInvalid: () => setShowNationalCodeValidator(true),
  })

  const navigateToShipping = () => {
    if (data?.accessToken) {
      handleCheckNationalCode()
    } else {
      setShowSignInModal(true)
    }
  }
  useEffect(() => {
    if (!data?.user?.partyId) return
    getCurrentQuery({
      ...ApiConstants,
    })
  }, [data?.user?.partyId, getCurrentQuery])

  const needToDisabled = useMemo(() => {
    return functionalNotification.length > 0
  }, [functionalNotification])

  const hasAwaitPayment = useMemo(() => {
    return awaitPaymentOrders.length > 0
  }, [awaitPaymentOrders])

  useEffect(() => {
    if (currentData?.data?.waitingOrders) {
      setAwaitPaymentOrders([...currentData!.data!.waitingOrders])
    }
  }, [currentData])

  const handleRemoveFromUi = (id: string) => {
    setAwaitPaymentOrders([...awaitPaymentOrders.filter((i) => i?.shoppingCartId !== id)])
  }

  useEffect(() => {
    const subsribtion = BasketNotificationSubjectFuncs.getNotificationRemoved().subscribe(
      (res: string) => {
        const firstFindedNothificationIndex = functionalNotification.findIndex(
          (i) => i.shoppingCartItemId === res,
        )
        if (firstFindedNothificationIndex >= 0) {
          const tempArray = [...functionalNotification]
          tempArray.splice(firstFindedNothificationIndex, 1)
          setFunctionalNotification([...tempArray])
        }
      },
    )
    return () => {
      subsribtion.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (basketData?.data?.notifications) {
      setFunctionalNotification([
        ...basketData!.data!.notifications!.filter(
          (i) =>
            i.type === 'AvaliableOtherVendor' ||
            i.type === 'AvaliableOtherProduct' ||
            i.type === 'UnAvailableInventory' ||
            i.type === 'InventoryChange',
        ),
      ])
    }
  }, [basketData])

  const BasketSummary: FC = () => {
    return (
      <SummaryCart
        usedPage="basket"
        currency={basketData?.data?.shoppingCartSummary?.currency ?? ''}
        totalDiscount={basketData?.data?.shoppingCartSummary?.totalDiscount ?? 0}
        paymentAmount={basketData?.data?.shoppingCartSummary?.totalAmount ?? 0}
        totalAmount={basketData?.data?.shoppingCartSummary?.totalOriginalAmount ?? 0}
        totalCount={basketData?.data?.shoppingCartSummary?.totalCount ?? 0}
        totalDiscountPercent={basketData?.data?.shoppingCartSummary?.totalDiscountPercent ?? 0}
        clickedCallBack={navigateToShipping}
        disabled={needToDisabled}
        hasAwaitPayment={hasAwaitPayment}
        loading={isLoading}
        hideButton={isSmall}
      />
    )
  }

  return (
    <Box sx={{ flexGrow: 1, mt: -6 }}>
      <Grid container p={{ sm: 6, lg: 0 }} columnSpacing={{ md: 6 }} rowGap={{ xs: 4, sm: 6 }}>
        {!basketData?.data?.vendors?.length && hasAwaitPayment && (
          <Grid item xs={12} sx={{ borderRadius: 2, py: 3 }}>
            <BasketAwaitPayment
              canceledCallBack={handleRemoveFromUi}
              timeHasOver={handleRemoveFromUi}
              orders={currentData?.data?.waitingOrders ?? []}
            />
          </Grid>
        )}

        {basketData?.data?.vendors && !!basketData?.data?.vendors?.length && (
          <>
            <Grid item container xs={12} md={9} rowGap={{ xs: 4, sm: 6 }} height="fit-content">
              {hasAwaitPayment && (
                <Grid item xs={12} sx={{ borderRadius: 2 }}>
                  <BasketAwaitPayment
                    canceledCallBack={handleRemoveFromUi}
                    timeHasOver={handleRemoveFromUi}
                    orders={currentData?.data?.waitingOrders ?? []}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <Stack
                  sx={{
                    flex: 1,
                    borderRadius: { xs: 0, sm: 2 },
                    bgcolor: 'common.white',
                    px: { md: 6, xs: 4 },
                    py: { sm: 8, xs: 4 },
                  }}
                  spacing={7}
                >
                  <BasketHeader count={basketData.data.shoppingCartSummary?.totalCount ?? 0} />
                  {basketData?.data?.vendors?.map((vendor, index) => {
                    return (
                      <ByVendor
                        key={vendor.vendorId}
                        notifications={basketData.data?.notifications ?? []}
                        index={index}
                        vendor={vendor}
                      />
                    )
                  })}
                </Stack>
              </Grid>
            </Grid>

            <Grid item container xs={12} md={3} rowGap={{ xs: 4, sm: 6 }} height="fit-content">
              {!isSmall && (
                <Grid item xs={12}>
                  <BasketSummary />
                </Grid>
              )}
              <Grid item xs={12}>
                <BasketFovorites />
              </Grid>
              {isSmall && (
                <Grid item xs={12}>
                  <BasketSummary />
                </Grid>
              )}
            </Grid>

            {isSmall && (
              <FakeSuspense delay={300}>
                <RenderInDom containerId="bottom-navigation-top-box">
                  <SmallSummaryCart
                    usedPage="basket"
                    currency={basketData.data.shoppingCartSummary?.currency ?? ''}
                    paymentAmount={basketData?.data?.shoppingCartSummary?.totalAmount ?? 0}
                    clickedCallBack={navigateToShipping}
                    hasAwaitPayment={hasAwaitPayment}
                    loading={isLoading}
                    disabled={needToDisabled}
                  />
                </RenderInDom>
              </FakeSuspense>
            )}
          </>
        )}

        {basketData?.data?.vendors && basketData?.data?.vendors?.length === 0 && <EmptyCart />}
        {showSignInModal && (
          <SignInModal open onClose={() => setShowSignInModal(false)} onSuccess={refetch} />
        )}
        {showNationalCodeValidator && (
          <NationalCodeValidationModal
            onSuccess={() => push('/checkout/shipping')}
            onClose={() => setShowNationalCodeValidator(false)}
          />
        )}
      </Grid>
    </Box>
  )
}

export default BasketPage
