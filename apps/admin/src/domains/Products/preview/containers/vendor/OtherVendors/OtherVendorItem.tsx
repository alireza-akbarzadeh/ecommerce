import { HBLink } from '@hasty-bazar/admin-shared/components'
import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Box, Grid, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import { stringify } from 'query-string'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { DeliveryName, VendorPrice } from '../../../components'
import ProductionDetailMessages from '../../../productDetail.messages'
import OtherVendorMessages from './OtherVendor.messages'
import VendorRate from './VendorRate'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'

interface IOtherVendorItemProps {
  vendor: any
  inventory: number
}

const OtherVendorItem: FC<IOtherVendorItemProps> = (props) => {
  const { vendor, inventory } = props
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)

  return (
    <Box
      sx={{ borderRadius: 2, backgroundColor: 'common.white', flexGrow: 1, p: { xs: 4, sm: 2 } }}
    >
      <Grid
        container
        columnGap={{ xs: 2, md: 4 }}
        rowGap={3}
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item xs={12} sm="auto" md={3}>
          <Stack direction="row" alignItems="center" spacing={4}>
            <HBLink target="_blank" href={`/vendor/?vendorId=${vendor.vendorId}`}>
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
                href={`/vendor/?vendorId=${stringify({
                  baseFilter: JSON.stringify({ vendorId: vendor.vendorId }),
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

        <Grid item xs={12} sm={2}>
          {vendor.delivery?.value && <DeliveryName name={vendor.delivery?.value ?? ''} />}
        </Grid>

        <Grid item xs={12} sm={2}>
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
        </Grid>

        <Grid
          item
          container
          xs={'auto'}
          md={4}
          rowGap={4}
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            ml: 'auto',
            p: { sm: 2 },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-end', md: 'center' },
          }}
        >
          <Grid item xs={2}>
            {!!vendor.finalPrice && (
              <VendorPrice
                currency={defaultCurrencyTitle}
                oldPrice={''}
                price={vendor.finalPrice}
                justifyContent="center"
              />
            )}
          </Grid>
          <Grid item xs={2}>
            <HBButton sx={{ width: { sm: 168, xs: 110, md: '100%' } }}>
              <Typography variant="button">
                <FormattedMessage {...ProductionDetailMessages.addToCart} />
              </Typography>
            </HBButton>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default OtherVendorItem
