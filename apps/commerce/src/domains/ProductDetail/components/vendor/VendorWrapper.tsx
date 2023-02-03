import { FakeSuspense, HBLink } from '@hasty-bazar-commerce/components'
import RenderInDom from '@hasty-bazar-commerce/components/RenderInDom'
import { SippingVisuality } from '@hasty-bazar-commerce/components/SippingVisuality'
import { AddToCartButton } from '@hasty-bazar-commerce/containers'
import SaveVendorButton from '@hasty-bazar-commerce/containers/SaveVendorButton'
import useBasketMethods from '@hasty-bazar-commerce/core/hook/useBasketMethods'
import useGetSavedVendors from '@hasty-bazar-commerce/core/hook/useGetSavedVendors'
import { calcDiscount } from '@hasty-bazar-commerce/utils'
import { HBButton, HBDivider, HBIcon } from '@hasty-bazar/core'
import { Box, Divider, Grid, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import Link from 'next/link'
import { stringify } from 'query-string'
import { isNil } from 'ramda'
import { FC, useEffect, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { VendorPrice } from '../../../../components'
import ProductionDetailMessages from '../../productDetail.messages'
import { useProductDetail } from '../../ProductDetailContext'
import { ProductDetailSubjectFuncs } from '../../ProductDetailSubjects'

const VendorWrapper: FC = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { formatMessage } = useIntl()

  const { product, activeUniqueProduct, activeOtherVendors } = useProductDetail()

  const { savedVendors } = useGetSavedVendors()
  const { count, product: basketProduct } = useBasketMethods({
    productId: activeUniqueProduct?.id ?? '',
    vendorId: product?.vendor?.id ?? '',
    coefficient: activeUniqueProduct?.orderAndInventorySetting?.multiplesOrder ?? 1,
  })

  const [savedId, setSavedId] = useState<string | null>(null)

  const gotoOtherVendors = () => {
    ProductDetailSubjectFuncs.expandedChange()
  }

  useEffect(() => {
    const saved = savedVendors?.find((i) => i.vendorId === product?.vendor?.id)
    if (saved) {
      setSavedId(saved.id!)
    } else {
      setSavedId('')
    }
  }, [savedVendors, product])

  const calcPrice = useMemo(() => {
    if (!activeUniqueProduct) return
    if (count === 0) {
      return {
        price: activeUniqueProduct.price,
        oldPrice: activeUniqueProduct.oldPrice ?? null,
        discount: activeUniqueProduct.discount,
      }
    } else {
      const discount = calcDiscount(basketProduct!.finalPrice!, basketProduct?.orginalPrice)
      return {
        price: basketProduct?.finalPrice,
        oldPrice: basketProduct?.orginalPrice,
        discount,
      }
    }
  }, [count, activeUniqueProduct, basketProduct])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        sx={{
          borderRadius: 4,
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
          p: 4,
          flex: 1,
          height: 'fit-content',
          justifyContent: 'space-between',
        }}
        direction={{ xs: 'column', sm: 'row', md: 'column' }}
        columnGap={{ sm: 0, md: 0, xs: 5 }}
        rowGap={4}
      >
        <Grid
          direction="column"
          item
          container
          rowGap={4}
          xs={!!activeUniqueProduct?.inventory && +activeUniqueProduct?.inventory > 0 ? 6 : 12}
        >
          <Grid item>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              {product?.vendor?.name && (
                <Stack direction="row" alignItems="center" spacing={4}>
                  <Typography variant="body2" color="text.primary">
                    <FormattedMessage {...ProductionDetailMessages.store} />
                  </Typography>
                  <HBLink
                    target="_blank"
                    href={`/vendor/?${stringify({
                      baseFilter: JSON.stringify({ vendors: [product?.vendor?.id] }),
                    })}`}
                  >
                    <Typography variant="subtitle2" color="info.main">
                      {product?.vendor?.name}
                    </Typography>
                  </HBLink>
                </Stack>
              )}

              {!isNil(savedId) && <SaveVendorButton vendorId={product?.vendor?.id!} />}
            </Stack>
          </Grid>
          {!!activeOtherVendors?.length && (
            <Grid item>
              <Stack spacing={4} divider={<HBDivider />}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={6}
                >
                  <Typography
                    variant="subtitle2"
                    color="info.main"
                    onClick={gotoOtherVendors}
                    sx={{ cursor: 'pointer' }}
                  >
                    <FormattedMessage
                      {...ProductionDetailMessages.otherVendorCount}
                      values={{ count: `${activeOtherVendors?.length}` }}
                    />
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          )}
        </Grid>
        <HBDivider />
        <Grid
          item
          xs={!!activeUniqueProduct?.inventory && +activeUniqueProduct?.inventory > 0 ? 5 : 12}
        >
          <Stack spacing={4} divider={<HBDivider />}>
            <Stack spacing={4}>
              {!!activeUniqueProduct?.deliveryMethod?.deliveryTime && (
                <SippingVisuality
                  image="/assets/svg/box-clock.svg"
                  text={activeUniqueProduct?.deliveryMethod?.deliveryTime}
                />
              )}
              {activeUniqueProduct?.deliveryMethod?.isFree && (
                <SippingVisuality
                  image="/assets/svg/box-arrow.svg"
                  text={formatMessage({ ...ProductionDetailMessages.freeDeliveryInTehran })}
                />
              )}

              {!!activeUniqueProduct?.inventory &&
                !!activeUniqueProduct.orderAndInventorySetting?.numberForShowCountInventory &&
                activeUniqueProduct?.inventory <=
                  activeUniqueProduct.orderAndInventorySetting?.numberForShowCountInventory && (
                  <>
                    <Divider variant="middle" sx={{ color: 'grey.200', my: 4 }} />
                    <Stack spacing={2.5} direction="row" alignItems="center">
                      <HBIcon sx={{ color: 'error.main' }} size="small" type="exclamationOctagon" />
                      <Typography variant="subtitle2" color="error.main">
                        <FormattedMessage
                          {...ProductionDetailMessages.lessThanWithCount}
                          values={{ count: `${activeUniqueProduct?.inventory}` }}
                        />
                      </Typography>
                    </Stack>
                  </>
                )}
            </Stack>

            {!isSmall &&
              !!activeUniqueProduct?.price &&
              !!activeUniqueProduct?.inventory &&
              +activeUniqueProduct?.inventory > 0 && (
                <VendorPrice
                  currency={activeUniqueProduct.currency?.name ?? null}
                  oldPrice={calcPrice?.oldPrice}
                  price={calcPrice?.price ?? 0}
                  discount={calcPrice?.discount}
                />
              )}
          </Stack>
        </Grid>

        {!isSmall && !!activeUniqueProduct?.inventory && +activeUniqueProduct?.inventory > 0 && (
          <Stack alignItems="center" direction="row" spacing={6}>
            <AddToCartButton
              productId={activeUniqueProduct.id ?? ''}
              vendorId={product?.vendor?.id ?? ''}
              maximumOrder={activeUniqueProduct?.orderAndInventorySetting?.maximalPerOrder ?? null}
              coefficient={activeUniqueProduct?.orderAndInventorySetting?.multiplesOrder ?? 1}
              inventory={activeUniqueProduct.inventory ?? 0}
            />
          </Stack>
        )}

        {!!activeUniqueProduct && !activeUniqueProduct?.inventory && (
          <Stack sx={{ flex: 1 }} alignItems="center">
            <HBButton sx={{ width: 168, height: 55 }} disabled>
              <FormattedMessage {...ProductionDetailMessages.unavailable} />
            </HBButton>
          </Stack>
        )}

        {isSmall && (
          <FakeSuspense delay={300}>
            <RenderInDom containerId="bottom-navigation-top-box">
              <Box sx={{ flexGrow: 1, px: 6, py: 4 }}>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="nowrap"
                >
                  <Grid
                    item
                    xs={activeUniqueProduct?.inventory ? 'auto' : 12}
                    container
                    direction="column"
                    gap={2}
                  >
                    <Grid item xs>
                      <AddToCartButton
                        sx={{
                          alignItems: 'flex-start',
                          flexWrap: 'wrap',
                          '& > button': { width: '100%' },
                        }}
                        dontShowText={isMobile}
                        productId={activeUniqueProduct?.id ?? ''}
                        vendorId={product?.vendor?.id ?? ''}
                        maximumOrder={
                          activeUniqueProduct?.orderAndInventorySetting?.maximalPerOrder ?? null
                        }
                        coefficient={
                          activeUniqueProduct?.orderAndInventorySetting?.multiplesOrder ?? 1
                        }
                        inventory={activeUniqueProduct?.inventory ?? 0}
                      />
                    </Grid>
                    {count > 0 && isMobile && (
                      <Grid item>
                        <Link href="/basket">
                          <Typography
                            sx={{ cursor: 'pointer' }}
                            variant="button"
                            color="primary.main"
                          >
                            <FormattedMessage {...ProductionDetailMessages.seeBasket} />
                          </Typography>
                        </Link>
                      </Grid>
                    )}
                  </Grid>
                  {!!activeUniqueProduct?.inventory && !!activeUniqueProduct?.price && (
                    <Grid item>
                      <VendorPrice
                        currency={activeUniqueProduct.currency?.name ?? null}
                        oldPrice={calcPrice?.oldPrice}
                        price={calcPrice?.price ?? 0}
                        discount={calcPrice?.discount}
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>
            </RenderInDom>
          </FakeSuspense>
        )}
      </Grid>
    </Box>
  )
}

export default VendorWrapper
