import { HBLink, SippingVisuality, VendorPrice } from '@hasty-bazar-commerce/components'
import { AddToCartButton } from '@hasty-bazar-commerce/containers'
import { GetAllOtherVendorsQueryModel } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { OrderAndInventorySettingDto } from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBIcon } from '@hasty-bazar/core'
import { Box, Grid, Hidden, Stack, SxProps, Typography } from '@mui/material'
import Image from 'next/image'
import { stringify } from 'query-string'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import OtherVendorMessages from './OtherVendor.messages'
import VendorRate from './VendorRate'

interface IOtherVendorItemProps extends OrderAndInventorySettingDto {
  vendor: GetAllOtherVendorsQueryModel
  inventory: number
}

const SippingVisualitySx: SxProps = {
  bgcolor: 'success.lighter',
  borderRadius: 2,
  p: 1,
  color: 'success.main',
  width: 'fit-content',
}

const OtherVendorItem: FC<IOtherVendorItemProps> = (props) => {
  const { vendor, inventory, maximalPerOrder } = props

  return (
    <Box
      sx={{ borderRadius: 2, backgroundColor: 'common.white', flexGrow: 1, p: { xs: 4, sm: 2 } }}
    >
      <Hidden smDown>
        <Grid
          container
          columnGap={{ xs: 2, md: 4 }}
          rowGap={3}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={12} sm="auto" md={3}>
            <Stack direction="row" alignItems="center" spacing={4}>
              <HBLink
                target="_blank"
                href={`/vendor/?${stringify({
                  baseFilter: JSON.stringify({ vendors: [vendor.vendorId] }),
                })}`}
              >
                <Box
                  sx={{
                    position: 'relative',
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                  }}
                >
                  <Image
                    layout="fill"
                    objectFit="contain"
                    objectPosition="center"
                    src={
                      vendor.icon
                        ? `${process.env.NEXT_PUBLIC_CDN}/${vendor.icon}`
                        : '/assets/svg/little-store.svg'
                    }
                  />
                </Box>
              </HBLink>

              <Stack
                direction={{ xs: 'row', sm: 'column' }}
                rowGap={3}
                alignItems={{ xs: 'center', sm: 'flex-start' }}
                justifyContent={{ xs: 'space-between', sm: 'center' }}
                width="100%"
              >
                <HBLink
                  target="_blank"
                  sx={{ textDecoration: 'unset', color: 'text.primary' }}
                  href={`/vendor/?${stringify({
                    baseFilter: JSON.stringify({ vendors: [vendor.vendorId] }),
                  })}`}
                >
                  <Typography variant="subtitle2">{vendor.name ?? '---'}</Typography>
                </HBLink>
                {!!vendor.vendorRate?.count && (
                  <VendorRate
                    count={`${vendor.vendorRate?.count ?? ''}`}
                    value={`${vendor.vendorRate.value ?? ''}`}
                  />
                )}
              </Stack>
            </Stack>
          </Grid>

          <Grid item>
            {vendor.delivery?.value && (
              <SippingVisuality
                sx={SippingVisualitySx}
                image="/assets/svg/box-arrow.svg"
                text={vendor.delivery?.value}
              />
            )}
          </Grid>
          <Grid item xs={2}>
            <AddToCartButton
              productId={vendor.productId ?? ''}
              vendorId={vendor?.vendorId ?? ''}
              dontShowText
              maximumOrder={maximalPerOrder}
              coefficient={1}
              inventory={inventory ?? 0}
            />
          </Grid>
        </Grid>
      </Hidden>

      <Hidden smUp>
        <Grid rowGap={2} container>
          <Grid item xs={12}>
            <Stack direction="row" alignItems="center" spacing={4}>
              <HBLink
                target="_blank"
                href={`/vendor/?${stringify({
                  baseFilter: JSON.stringify({ vendors: [vendor.vendorId] }),
                })}`}
              >
                <Box
                  sx={{
                    position: 'relative',
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                  }}
                >
                  <Image
                    layout="fill"
                    objectFit="contain"
                    objectPosition="center"
                    src={
                      vendor.icon
                        ? `${process.env.NEXT_PUBLIC_CDN}/${vendor.icon}`
                        : '/assets/svg/little-store.svg'
                    }
                  />
                </Box>
              </HBLink>

              <Stack
                direction={{ xs: 'row', sm: 'column' }}
                rowGap={3}
                alignItems={{ xs: 'center', sm: 'flex-start' }}
                justifyContent={{ xs: 'space-between', sm: 'center' }}
                width="100%"
              >
                <HBLink
                  target="_blank"
                  sx={{ textDecoration: 'unset', color: 'text.primary' }}
                  href={`/vendor/?${stringify({
                    baseFilter: JSON.stringify({ vendors: [vendor.vendorId] }),
                  })}`}
                >
                  <Typography variant="subtitle2">{vendor.name ?? '---'}</Typography>
                </HBLink>
                {!!vendor.vendorRate?.count && (
                  <VendorRate
                    hideText
                    count={`${vendor.vendorRate?.count ?? ''}`}
                    value={`${vendor.vendorRate.value ?? ''}`}
                  />
                )}
              </Stack>
            </Stack>
          </Grid>
          <Grid spacing={2} container>
            <Grid item xs={6}>
              <Stack spacing={2} justifyContent="space-between" sx={{ height: '100%' }}>
                {!!vendor.guaranty && (
                  <Stack
                    sx={{ color: 'text.primary' }}
                    spacing={2}
                    direction="row"
                    alignItems="center"
                    justifyContent={{ sm: 'center' }}
                  >
                    <HBIcon type={vendor.guaranty.value ? 'shieldCheck' : 'multiply'} />
                    <Typography variant="subtitle2">
                      <FormattedMessage
                        {...OtherVendorMessages[vendor.guaranty ? 'hasGuaranty' : 'hasNoGuaranty']}
                      />
                    </Typography>
                  </Stack>
                )}
                {vendor.delivery?.value && (
                  <SippingVisuality
                    sx={SippingVisualitySx}
                    image="/assets/svg/box-arrow.svg"
                    text={vendor.delivery?.value}
                  />
                )}
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={2}>
                {!!vendor.finalPrice && (
                  <VendorPrice
                    currency={vendor.currency ?? ''}
                    oldPrice={''}
                    price={vendor.finalPrice}
                    justifyContent="flex-end"
                  />
                )}
                <AddToCartButton
                  productId={vendor.productId ?? ''}
                  vendorId={vendor?.vendorId ?? ''}
                  dontShowText
                  maximumOrder={inventory ?? null}
                  coefficient={1}
                  inventory={inventory ?? 0}
                />
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Hidden>
    </Box>
  )
}

export default OtherVendorItem
