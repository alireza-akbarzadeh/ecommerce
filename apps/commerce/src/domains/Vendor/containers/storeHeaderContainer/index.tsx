import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { IFilterParams } from '@hasty-bazar-commerce/domains/Search/searchFilterModels'
import { useGetWebCatalogVendorsByIdSellerPageDescQuery } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { Box, Grid, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import VendorMessages from '../../Vendor.messages'

function StoreHeaderContainer() {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const params: Partial<IFilterParams> = Object.entries(router.query).reduce(
    (prev, [key, value]) => {
      if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
        prev = { ...prev, [key]: JSON.parse(value) }
      } else prev = { ...prev, [key]: value }
      return prev
    },
    {},
  )
  const vendorId = params?.baseFilter?.vendors?.[0] ?? ''

  const { data: { data: sellerPageDesc } = {} } = useGetWebCatalogVendorsByIdSellerPageDescQuery({
    ...ApiConstants,
    id: vendorId,
  })

  return (
    <Grid
      container
      xs={12}
      gap={6}
      m={'auto'}
      sx={{ backgroundColor: 'common.white', p: 6, mb: 2, borderRadius: { sm: 2, xs: 0 } }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h5">{formatMessage(VendorMessages.description)}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box
            component={'div'}
            sx={{
              border: 1,
              borderRadius: 4,
              borderColor: ({ palette }) => palette.grey[200],
              p: 4,
              height: '100%',
            }}
            dangerouslySetInnerHTML={{ __html: sellerPageDesc?.fullDescription || '' }}
          ></Box>
        </Grid>
        {/* this section removed for current state of product jan 23 */}
        {/* <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              border: 1,
              borderRadius: 4,
              borderColor: ({ palette }) => palette.grey[200],
              p: 4,
            }}
          >
            <Grid container spacing={2}>
              {sellerPageDesc?.chartItems?.map(({ title, percentage }) => (
                <Grid item xs={6}>
                  <Percentage percentNumber={String(percentage)} percentCaption={title!} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid> */}
      </Grid>

      <Grid container xs={12} gap={6}>
        <Stack width={'100%'} gap={6} flexDirection={{ sm: 'row', xs: 'column' }} flexWrap={'wrap'}>
          {sellerPageDesc?.innerBanners?.map((banner, index) => {
            return (
              <Box
                sx={{
                  borderRadius: 2,
                  width: { sm: `${index !== 0 && 'calc( 100% / 2 - 12px)'}`, xs: '100%' },
                  height: 177,
                  position: 'relative',
                }}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_CDN}${banner ?? ''}`}
                  layout="fill"
                  style={{ borderRadius: 8 }}
                />
              </Box>
            )
          })}
        </Stack>
      </Grid>
    </Grid>
  )
}

export default StoreHeaderContainer
