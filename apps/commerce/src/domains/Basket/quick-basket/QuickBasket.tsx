import { CommerceIconButton, HBLink } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import useGetMinimal from '@hasty-bazar-commerce/core/hook/useGetMinimal'
import { useGetWebSaleOrdersWaitingQuery } from '@hasty-bazar-commerce/services/saleApi.generated'
import { commafy, HBButton, HBIcon, useScrollLock } from '@hasty-bazar/core'
import { pxToRem } from '@hasty-bazar/material-provider'
import { Box, Divider, Drawer, Stack, styled, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { FC, useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import BasketMessages from '../basket.messages'
import Bill from './components/Bill'
import QuickBasketItem from './QuickBasketItem'

interface IQuickBasketProps {
  open: boolean
  setClose: () => void
}

const VendorGroupStyle = styled(Stack)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(2, 4),
}))

const DividerStyle = styled(Divider)(({ theme }) => ({
  borderColor: theme.palette.grey[100],
}))

const QuickBasket: FC<IQuickBasketProps> = (props) => {
  const { open, setClose } = props
  const { data } = useSession()

  const { toggleScrollLock } = useScrollLock()
  const { data: minimalBasket } = useGetMinimal()
  const { data: currentData } = useGetWebSaleOrdersWaitingQuery(
    {
      ...ApiConstants,
    },
    { skip: !data?.user?.partyId },
  )

  useEffect(() => {
    toggleScrollLock(open)
  }, [open, toggleScrollLock])

  const hasAwaitPayment = useMemo(() => {
    return currentData?.data?.waitingOrders && currentData?.data?.waitingOrders?.length > 0
  }, [currentData])

  return (
    <Drawer anchor="right" open={open} onClose={setClose}>
      <Stack spacing={4} sx={{ width: 444, overflow: 'auto', height: '100%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" pt={6} px={6}>
          {!!minimalBasket?.totalCount && (
            <FormattedMessage
              {...BasketMessages.cartWithCount}
              values={{ count: minimalBasket?.totalCount }}
            />
          )}
          {!minimalBasket?.totalCount && <Box />}
          <CommerceIconButton
            sx={{ minWidth: pxToRem(24), maxWidth: pxToRem(24), height: pxToRem(24) }}
            onClick={() => setClose()}
            icon={<HBIcon type="multiply" size="small" sx={{ color: 'grey.900' }} />}
          />
        </Stack>
        <DividerStyle />
        {!!minimalBasket?.totalCount && hasAwaitPayment && (
          <>
            <DividerStyle />
            <Stack sx={{ pr: 7, pl: 7 }} spacing={2}>
              <Typography>
                <FormattedMessage
                  {...BasketMessages.awaitPaymentCount}
                  values={{ count: currentData!.data!.waitingOrders!.length }}
                />
              </Typography>
              <Stack sx={{ width: '100%' }} direction="row" justifyContent="flex-end">
                <HBLink href="/profile/order-tracking/current/">
                  <HBButton onClick={() => setClose()}>
                    <FormattedMessage {...BasketMessages.gotoOrders} />
                  </HBButton>
                </HBLink>
              </Stack>
            </Stack>
          </>
        )}
        {!!minimalBasket?.totalCount && (
          <Box sx={{ overflow: 'auto' }}>
            <Stack spacing={4}>
              {minimalBasket?.vendors?.map((vendor) => (
                <Stack
                  key={`quick-basket${vendor.vendorId}`}
                  spacing={2}
                  sx={{ overflow: 'auto' }}
                  px={6}
                >
                  <VendorGroupStyle direction="row" spacing={1}>
                    <Typography variant="overline" color="text.secondary">
                      <FormattedMessage {...BasketMessages.vendor} />
                    </Typography>
                    <Typography variant="overline">{vendor.vendorName}</Typography>
                  </VendorGroupStyle>
                  {vendor?.items?.map((cartItem) => {
                    return (
                      <>
                        <QuickBasketItem
                          item={{ ...cartItem }}
                          notifications={minimalBasket.notifications?.filter(
                            (n) => n.shoppingCartItemId === cartItem.shoppingCartItemId,
                          )}
                          vendorId={vendor.vendorId ?? ''}
                        />
                        <DividerStyle />
                      </>
                    )
                  })}
                </Stack>
              ))}
            </Stack>
          </Box>
        )}

        {!minimalBasket?.totalCount && (
          <>
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={{
                height: 'calc(100% - 185px)',
              }}
            >
              <Image
                src="/assets/svg/empty-basket.svg"
                width={160}
                height={136}
                alt="basket-empty"
              />
              <Box color="grey.900" mt={6}>
                <FormattedMessage {...BasketMessages.yourBasketIsEmpty} />
              </Box>
            </Stack>

            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={{ pt: 4, boxShadow: `0px 0px ${pxToRem(16)} rgba(0, 0, 0, 0.1)` }}
            >
              <HBButton variant="contained" type="button" color="primary" disabled>
                <FormattedMessage {...BasketMessages.registerOrder} />
              </HBButton>
              <Box
                color="info.main"
                sx={(theme) => ({
                  fontSize: theme.typography.body2,
                  fontWeight: 400,
                })}
                mt={3.5}
                mb={5.5}
              >
                <FormattedMessage {...BasketMessages.viewFullBasket} />
              </Box>
            </Stack>
          </>
        )}

        {!!minimalBasket?.totalCount && (
          <Bill
            disableShippment={!!minimalBasket.notifications?.length || !!hasAwaitPayment}
            routeToBasketCallback={() => setClose()}
            currency={minimalBasket.currency ?? ''}
            totalAmount={commafy(minimalBasket.totalAmount) ?? 0}
            totalDiscount={
              minimalBasket.totalDiscount ? commafy(minimalBasket.totalDiscount) : null
            }
          />
        )}
      </Stack>
    </Drawer>
  )
}

export default QuickBasket
