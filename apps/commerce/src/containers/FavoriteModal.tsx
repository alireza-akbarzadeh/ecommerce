import DefaultHeaderMessges from '@hasty-bazar-commerce/components/HBDefaultHeader/DefaultHeader.messages'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import CardWidgetCustom from '@hasty-bazar-commerce/domains/Landing/components/CardWidgetCustom'
import OrderTrackingMessages from '@hasty-bazar-commerce/domains/Profile/orderTracking/orderTracking.messages'
import { useGetWebCatalogCommerceFavoriteProductQuery } from '@hasty-bazar-commerce/Service-Enhancers/FavoriteEnhances'
import { CollectionData, HBButton, HBCardWidgetList, HBIcon } from '@hasty-bazar/core'
import { Backdrop, Popper, Stack, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

interface IFavoriteModalProps {
  open: boolean
  onClose: () => void
  top: number
  anchorEl: HTMLElement | null
}

const pageSize = 10
const pageNumber = 1

const FavoriteModal: FC<IFavoriteModalProps> = (props) => {
  const { onClose, open, top, anchorEl } = props
  const { data } = useSession()
  const { push } = useRouter()
  const { formatMessage } = useIntl()

  const { data: favorites } = useGetWebCatalogCommerceFavoriteProductQuery(
    {
      ...ApiConstants,
      pageNumber,
      pageSize,
    },
    { skip: !data?.user },
  )

  const convertToContentData = useMemo(() => {
    let contents: CollectionData[] = []
    if (!favorites?.data) return
    contents = favorites?.data?.map((item, index) => {
      return {
        currencyName: item.currency,
        ...(!!item.shippingObligation && {
          deliveryMethod: { name: item.shippingObligation.value },
        }),
        discountPercentage: +(item.discount ?? 0),
        id: item.productId,
        imageUrl: item.imageUrl,
        name: item.productName,
        oldPrice: item.orginalPrice,
        price: item.finalPrice ?? null,
        rate: item.vendorRate?.value,
        rateCount: item.vendorRate?.count?.toString(),
        title: item.productName,
        parentId: item.productClassId,
        quantity: item.quantity,
        ...(!item.quantity
          ? { quantityHtml: formatMessage({ ...OrderTrackingMessages.unAvailable }) }
          : null),
        storeName: item.vendor?.storeName,
      }
    })

    return contents
  }, [favorites])

  return (
    <>
      <Backdrop
        sx={{ backgroundColor: 'inherit', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={() => onClose()}
      />
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          top,
        }}
        open={open}
        onClick={() => onClose()}
      />
      <Popper
        placement="bottom-start"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
        open={open}
        anchorEl={anchorEl}
      >
        <Stack
          sx={{ width: (theme) => theme.breakpoints.values.lg }}
          direction="row"
          justifyContent="center"
        >
          <Stack
            p={6}
            spacing={4}
            sx={{
              borderBottomRightRadius: 16,
              borderBottomLeftRadius: 16,
              bgcolor: 'common.white',
              width: (theme) => theme.breakpoints.values.lg,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={4}>
              <Typography variant="h6" color="text.primary">
                <FormattedMessage {...DefaultHeaderMessges.favoriteList} />
              </Typography>

              <HBButton
                onClick={() => {
                  push('/favorite')
                  onClose()
                }}
                variant="text"
                sx={{ color: (theme) => `${theme.palette.info.main}!important` }}
              >
                <Stack spacing={1.5} direction="row" alignItems="center">
                  <FormattedMessage {...DefaultHeaderMessges.seeFavorites} />
                  <HBIcon type="angleLeft" />
                </Stack>
              </HBButton>
            </Stack>
            <HBCardWidgetList
              type="BUSINESS_SLIDER_DEFAULT"
              content={{ title: '', data: convertToContentData as CollectionData[] }}
              prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
              cardWidgetCustom={CardWidgetCustom}
              noDivider
            />
          </Stack>
        </Stack>
      </Popper>
    </>
  )
}

export default FavoriteModal
