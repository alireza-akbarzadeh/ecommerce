import { HBLink } from '@hasty-bazar/admin-shared/components'
import {
  useGetAdminCatalogProductsOtherVendorPreviewByProductIdQuery,
  useGetAdminCatalogProductsPreviewByIdQuery,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Box, Divider, Grid, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import { stringify } from 'query-string'
import React, { FC, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import ProductionDetailMessages from '../../productDetail.messages'
import { ProductDetailSubjectFuncs } from '../../ProductDetailSubjects'

const VendorWrapper: FC = () => {
  const { id } = useRouter().query as { id: string }
  const productData = useGetAdminCatalogProductsPreviewByIdQuery({
    'client-name': 'HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.0',
    id,
  })
  const product = productData.data?.data || {}
  const activeOtherVendorsData = useGetAdminCatalogProductsOtherVendorPreviewByProductIdQuery({
    'client-name': 'HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.0',
    productId: id,
  })
  const activeOtherVendors = activeOtherVendorsData.data?.data?.vendors || []
  const activeUniqueProduct = productData.data?.data?.uniqueProducts?.find((item) => item.id === id)
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const [savedId, setSavedId] = useState<string | null>(null)

  const gotoOtherVendors = () => {
    ProductDetailSubjectFuncs.expandedChange()
  }

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
        rowGap={8}
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
                    <FormattedMessage {...ProductionDetailMessages.vendor} />
                  </Typography>
                  <HBLink
                    target="_blank"
                    href={`/vendor/?${stringify({
                      baseFilter: JSON.stringify({ vendorId: product?.vendor?.id }),
                    })}`}
                  >
                    <Typography variant="subtitle2" color="info.main">
                      {product?.vendor?.name}
                    </Typography>
                  </HBLink>
                </Stack>
              )}

              <HBButton
                variant="text"
                sx={{
                  minWidth: 0,
                  p: 0,
                  border: 'none!important',
                  gap: 2,
                  color: (theme) => `${theme.palette.info.main}!important`,
                }}
              >
                <HBIcon type="bookmark" />
                <Typography variant="button">
                  <FormattedMessage {...ProductionDetailMessages.addToSaveVendor} />
                </Typography>
              </HBButton>
            </Stack>
          </Grid>

          <Grid item>
            <Stack spacing={4} divider={<Divider variant="middle" sx={{ color: 'grey.200' }} />}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={6}>
                {activeOtherVendors && activeOtherVendors?.length > 0 && (
                  <HBButton
                    sx={{ px: 0, minWidth: 'unset', border: 'none!important' }}
                    variant="text"
                    onClick={() => gotoOtherVendors()}
                  >
                    <Typography variant="body2" color="info.main">
                      <FormattedMessage
                        {...ProductionDetailMessages.otherVendorCount}
                        values={{ count: `${activeOtherVendors?.length}` }}
                      />
                    </Typography>
                  </HBButton>
                )}
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Grid
          item
          xs={!!activeUniqueProduct?.inventory && +activeUniqueProduct?.inventory > 0 ? 5 : 12}
        >
          <Stack spacing={4}>
            {!!activeUniqueProduct?.deliveryMethod &&
              !!activeUniqueProduct.deliveryMethod.deliveryTime && (
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="body2" color="text.primary">
                    {activeUniqueProduct.deliveryMethod.deliveryTime}
                  </Typography>
                  {activeUniqueProduct.deliveryMethod.isFree && (
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      sx={{ bgcolor: 'success.light', px: 4, py: 0.75, borderRadius: 2 }}
                    >
                      <Typography variant="caption" color="success.main">
                        <FormattedMessage {...ProductionDetailMessages.freeDelivery} />
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              )}
            {/* {activeUniqueProduct?.deliveryMethod?.name && (
              <DeliveryName name={activeUniqueProduct?.deliveryMethod?.name} />
            )} */}

            {!!activeUniqueProduct?.inventory && activeUniqueProduct?.inventory < 5 && (
              <Stack spacing={2.5} direction="row" alignItems="center">
                <HBIcon sx={{ color: 'error.main' }} size="small" type="exclamationOctagon" />
                <Typography variant="subtitle2" color="error.main">
                  {+activeUniqueProduct?.inventory === 0 ? (
                    <FormattedMessage {...ProductionDetailMessages.noAvailable} />
                  ) : +activeUniqueProduct?.inventory <=
                    (activeUniqueProduct.orderAndInventorySetting?.minimalForAlert ?? 0) ? (
                    <FormattedMessage
                      {...ProductionDetailMessages.lessThanWithCount}
                      values={{ count: `${activeUniqueProduct?.inventory}` }}
                    />
                  ) : null}
                </Typography>
              </Stack>
            )}
          </Stack>

          {/* {!isSmall &&
            !!activeUniqueProduct?.price &&
            !!activeUniqueProduct?.inventory &&
            +activeUniqueProduct?.inventory > 0 && (
              <VendorPrice
                currency={activeUniqueProduct.currency?.name ?? null}
                oldPrice={activeUniqueProduct.oldPrice ?? null}
                price={activeUniqueProduct.price}
                discount={activeUniqueProduct.discount}
              />
            )} */}
        </Grid>

        {!isSmall && !!activeUniqueProduct?.inventory && +activeUniqueProduct?.inventory > 0 && (
          <Stack alignItems="center" direction="row" spacing={6}>
            <HBButton fullWidth={!isSmall} sx={{ width: { sm: 168, xs: 110, md: '100%' } }}>
              <Typography variant="button">
                <FormattedMessage {...ProductionDetailMessages.addToCart} />
              </Typography>
            </HBButton>
          </Stack>
        )}

        {!!activeUniqueProduct && !activeUniqueProduct?.inventory && (
          <Stack sx={{ flex: 1 }} alignItems="center">
            <HBButton sx={{ width: 168, height: 55 }} disabled>
              <FormattedMessage {...ProductionDetailMessages.unavailable} />
            </HBButton>
          </Stack>
        )}

        {/* {isSmall && (
          <FakeSuspense delay={300}>
            <RenderInDom containerId="bottom-navigation-top-box">
              <Box sx={{ flexGrow: 1, px: 6, py: 4 }}>
                <Grid container justifyContent="space-between" alignItems="center">
                  {!!activeUniqueProduct?.inventory && +activeUniqueProduct?.inventory > 0 ? (
                    <>
                      <Grid item>
                        <AddToCartButton
                          productId={activeUniqueProduct?.id ?? ''}
                          vendorId={product?.vendor?.id ?? ''}
                          maximumOrder={
                            activeUniqueProduct?.orderAndInventorySetting?.maximalPerOrder ?? null
                          }
                          coefficient={
                            activeUniqueProduct?.orderAndInventorySetting?.multiplesOrder ?? 1
                          }
                        />
                      </Grid>
                      <Grid item>
                        {!!activeUniqueProduct?.price && (
                          <VendorPrice
                            currency={activeUniqueProduct.currency?.name ?? null}
                            oldPrice={activeUniqueProduct.oldPrice ?? null}
                            price={activeUniqueProduct.price}
                          />
                        )}
                      </Grid>
                    </>
                  ) : (
                    <Grid item xs={12}>
                      <HBButton fullWidth disabled>
                        <FormattedMessage {...ProductionDetailMessages.unavailable} />
                      </HBButton>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </RenderInDom>
          </FakeSuspense>
        )} */}
      </Grid>
    </Box>
  )
}

export default VendorWrapper
