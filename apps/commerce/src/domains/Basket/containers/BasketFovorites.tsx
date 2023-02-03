import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import CardWidgetCustom from '@hasty-bazar-commerce/domains/Landing/components/CardWidgetCustom'
import { useLazyGetWebCatalogCommerceFavoriteProductQuery } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { CollectionData, HBCardWidgetList } from '@hasty-bazar/core'
import { Box, Theme, useMediaQuery } from '@mui/material'
import { useSession } from 'next-auth/react'
import { FC, useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'
import BasketMessages from '../basket.messages'

const BasketFovorites: FC = () => {
  const { data } = useSession()
  const breakpointMdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const [getFavoriteQuery, { data: favorites }] = useLazyGetWebCatalogCommerceFavoriteProductQuery()
  const { formatMessage } = useIntl()

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
          ? { quantityHtml: formatMessage({ ...BasketMessages.unavailable }) }
          : null),
        storeName: item.vendor?.storeName,
      }
    })

    return [...(contents ?? [])]
  }, [favorites])

  useEffect(() => {
    if (!data?.user.partyId) return
    getFavoriteQuery({
      ...ApiConstants,
      pageNumber: 1,
      pageSize: 10,
    })
  }, [data?.user.partyId, getFavoriteQuery])

  if (!!data?.user.partyId && !!favorites?.data?.length)
    return (
      <Box
        width={(theme) => ({ xs: `calc(100% - ${theme.spacing(12)})`, md: 'unset' })}
        ml={{
          xs: 6,
          md: 'unset',
        }}
        sx={{
          '& div.swiper-slide > div > a > div': {
            width: 220,
          },
        }}
      >
        <HBCardWidgetList
          type="BUSINESS_SLIDER_DEFAULT"
          content={{
            title: formatMessage({ ...BasketMessages.favorites }),
            data: convertToContentData as CollectionData[],
          }}
          prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
          cardWidgetCustom={CardWidgetCustom}
          noDivider={!breakpointMdDown}
        />
      </Box>
    )
  return null
}

export default BasketFovorites
