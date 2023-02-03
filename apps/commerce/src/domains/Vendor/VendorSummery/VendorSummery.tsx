import { CommerceLoading, ShareModal } from '@hasty-bazar-commerce/components'
import SaveVendorButton from '@hasty-bazar-commerce/containers/SaveVendorButton'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { ShowTostType } from '@hasty-bazar-commerce/domains/Profile/addressManagment/AddressManagment'
import { IFilterParams } from '@hasty-bazar-commerce/domains/Search/searchFilterModels'
import { useGetWebCatalogVendorsByIdSellerPageHeaderQuery } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { isServer } from '@hasty-bazar-commerce/utils'
import { HBButton, HBIcon, HBRating, HBToast } from '@hasty-bazar/core'
import { Box, Container, Grid, Paper, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import VendorMessages from '../Vendor.messages'
import { HBVendorStyledPaper } from './VendorSummery.styles'

export const VendorSummery = () => {
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

  const [showToast, setShowToast] = useState<ShowTostType>({ open: false, message: '' })
  const [openShareModal, setOpenShareModal] = useState(false)

  const { data: { data: sellerPageHeader } = {}, isLoading } =
    useGetWebCatalogVendorsByIdSellerPageHeaderQuery({
      ...ApiConstants,
      id: vendorId,
    })

  return (
    <>
      {isLoading && <CommerceLoading />}
      <Container
        maxWidth="lg"
        sx={{ p: { xs: `${0} !important`, md: `${3} !important` }, borderRadius: { md: 2, xs: 0 } }}
      >
        <Stack justifyContent="center" alignItems={'center'}>
          <Image
            src={
              sellerPageHeader?.storeBanner && sellerPageHeader.storeBanner.length > 5
                ? process.env.NEXT_PUBLIC_CDN + sellerPageHeader.storeBanner
                : '/assets/emptyCover.png'
            }
            width={1128}
            height={239}
            objectFit="cover"
            alt="storeBanner"
          />
        </Stack>
        <Stack
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={6}
          p={({ spacing }) => spacing(4, 6)}
          component={Paper}
          mb={{ md: 4, xs: 1 }}
          elevation={0}
          sx={(theme) => ({ borderRadius: { md: theme.spacing(0, 0, 2, 2) }, xs: 0 })}
        >
          <Box width={100} height={{ sm: 100, xs: 'unset' }} margin={`auto !important`}>
            <HBVendorStyledPaper sx={{ mt: { sm: 'inherit', xs: -15 } }}>
              <Image
                src={
                  sellerPageHeader?.storeLogo && sellerPageHeader.storeLogo.length > 5
                    ? process.env.NEXT_PUBLIC_CDN + sellerPageHeader.storeLogo
                    : '/assets/svg/store.svg'
                }
                width={100}
                height={100}
                alt="storeLogo"
              />
            </HBVendorStyledPaper>
          </Box>

          <Grid item xs={12} md={11} sm={10} container>
            <Grid
              xs={12}
              sm={10}
              container
              gap={2}
              justifyContent={{ sm: 'inherit', xs: 'center' }}
            >
              <Stack flexDirection={{ sm: 'row' }} gap={1} alignItems={'center'}>
                <Typography variant="h4" component="h1">
                  {sellerPageHeader?.storeName}
                </Typography>
                <Box display={'flex'} alignItems={'center'} gap={1}>
                  <HBRating
                    readOnly
                    size="small"
                    value={sellerPageHeader?.rate ?? 0}
                    precision={0.1}
                  />
                  <Typography variant="caption" color="text.secondary">
                    <FormattedMessage
                      {...VendorMessages.basedOnCommentsCount}
                      values={{
                        value: sellerPageHeader?.commentsCount ?? 0,
                      }}
                    />
                  </Typography>
                </Box>
              </Stack>
              {sellerPageHeader?.description && (
                <Grid item xs={12} textAlign={{ xs: 'center', sm: 'left' }}>
                  <Typography variant="subtitle1">{sellerPageHeader?.description}</Typography>
                </Grid>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              sm={2}
              container
              alignItems={'flex-start'}
              alignContent={'center'}
              my={{ xs: 4, sm: 0 }}
              sx={(theme) => ({
                borderTop: { xs: `1px solid ${theme.palette.grey[100]}`, sm: 'none' },
                borderBottom: { xs: `1px solid ${theme.palette.grey[100]}`, sm: 'none' },
              })}
            >
              <Grid item xs={6} sm={12} container justifyContent="center" alignItems="center">
                <SaveVendorButton vendorId={String(vendorId)} />
              </Grid>
              <Grid item xs={6} sm={12} container justifyContent="center" alignItems="center">
                <HBButton
                  onClick={() => setOpenShareModal(true)}
                  variant="text"
                  startIcon={
                    <HBIcon
                      type="shareAlt"
                      sx={(theme) => ({
                        color: theme.palette.info.main,
                      })}
                    />
                  }
                >
                  <Typography variant="subtitle2" color="info.main">
                    {formatMessage(VendorMessages.shareTitle)}
                  </Typography>
                </HBButton>
              </Grid>
            </Grid>
            <Stack
              flexDirection={{ md: 'row' }}
              gap={3}
              width={'100%'}
              alignItems={{ xs: 'center', sm: 'inherit' }}
            >
              <Stack flexDirection={'row'} alignItems={'center'} gap={3}>
                {sellerPageHeader?.plaque && (
                  <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
                    <HBIcon
                      type="postcard"
                      sx={(theme) => ({
                        color: theme.palette.text.secondary,
                      })}
                    />
                    <Typography variant="subtitle2" color="text.secondary">
                      {formatMessage(VendorMessages.plaque)} {sellerPageHeader?.plaque}
                    </Typography>
                  </Stack>
                )}
                <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
                  <HBIcon
                    type="shoppingCart"
                    sx={(theme) => ({
                      color: theme.palette.text.secondary,
                    })}
                  />
                  <Typography variant="subtitle2" color="text.secondary">
                    {sellerPageHeader?.orderCount ?? 0} {formatMessage(VendorMessages.order)}
                  </Typography>
                </Stack>
                {sellerPageHeader?.city && (
                  <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
                    <HBIcon
                      type="locationPoint"
                      sx={(theme) => ({
                        color: theme.palette.text.secondary,
                      })}
                    />
                    <Typography variant="subtitle2" color="text.secondary">
                      {sellerPageHeader?.city}
                    </Typography>
                  </Stack>
                )}
              </Stack>
              <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
                <HBIcon
                  type="usersAlt"
                  sx={(theme) => ({
                    color: theme.palette.text.secondary,
                  })}
                />
                <Typography variant="subtitle2" color="text.secondary">
                  {sellerPageHeader?.localSavedCount} {formatMessage(VendorMessages.saveVendorText)}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Stack>
      </Container>
      <ShareModal
        open={openShareModal}
        title=""
        shareUrl={!isServer() ? window.location.href : ''}
        onClose={() => {
          setOpenShareModal(false)
        }}
      />
      <HBToast
        open={showToast.open}
        message={showToast.message}
        type={showToast?.type || 'error'}
        vertical="top"
        autoHideDuration={6000}
        onClose={() => setShowToast({ open: false, message: '', type: showToast?.type })}
      />
    </>
  )
}
