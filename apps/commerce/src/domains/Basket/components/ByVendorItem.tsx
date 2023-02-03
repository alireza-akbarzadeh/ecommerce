import { AttributeHandler, HBLink, ImageShow, VendorPrice } from '@hasty-bazar-commerce/components'
import { AddToCartButton } from '@hasty-bazar-commerce/containers'
import { BasketItemDto, NotificationDto } from '@hasty-bazar-commerce/services/saleApi.generated'
import { Grid, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { FC, PropsWithChildren, useEffect, useMemo } from 'react'
import BuyNotification from './BuyNotification'

export interface IByVendorItemProps {
  item: BasketItemDto
  vendorId: string
  notifications?: NotificationDto[]
  changeAccordionStatus: (status: boolean) => void
}

const unavailableShowItems = [
  'UnAvailableInventory',
  // 'AvaliableOtherVendor',
  // 'AvaliableOtherProduct',
]

const availableShowItems = ['AvaliableOtherVendor', 'AvaliableOtherProduct']

const productDetailRoute = ({ slug, hsin }: { slug?: string | null; hsin?: string | null }) =>
  `/product/${hsin}/${slug}`

const Link: FC<PropsWithChildren<{ link: string }>> = ({ link, children }) => {
  return (
    <HBLink target="_blank" sx={{ textDecoration: 'none', color: 'text.primary' }} href={link}>
      {children}
    </HBLink>
  )
}

const ByVendorItem: FC<IByVendorItemProps> = (props) => {
  const { item, vendorId, notifications, changeAccordionStatus } = props
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'))

  useEffect(() => {
    if (
      item.shoppingCartQuantity &&
      item.avaliableCount &&
      item.shoppingCartQuantity > item.avaliableCount
    ) {
      changeAccordionStatus(true)
    } else {
      changeAccordionStatus(false)
    }
  }, [changeAccordionStatus, item.avaliableCount, item.shoppingCartQuantity])

  const getInventory = useMemo(() => {
    if (unavailableShowItems.some((i) => notifications?.find((j) => j.type === i))) {
      return 0
    } else if (availableShowItems.some((i) => notifications?.find((j) => j.type === i))) {
      return (
        notifications?.find((i) => i.productId === item.productId)?.metaData?.availableQuantity ?? 0
      )
    } else {
      return item.avaliableCount ?? 0
    }
  }, [notifications, item.avaliableCount, item.productId])

  return (
    <>
      <Stack direction="row-reverse" justifyContent="space-between" spacing={4}>
        <Stack
          direction={{ sm: 'row', xs: 'column' }}
          justifyContent={{ sm: 'space-between', xs: 'flex-start' }}
          sx={{ flex: 1 }}
          spacing={2}
        >
          <Grid container columns={3}>
            <Grid item sm={2} xs={3}>
              <Stack spacing={4}>
                <Link
                  link={productDetailRoute({
                    slug: item?.slug,
                    hsin: item?.hsin,
                  })}
                >
                  <Typography variant="subtitle2">{item.productName}</Typography>
                </Link>

                <Stack spacing={2}>
                  <AttributeHandler
                    attributes={
                      item.attribute?.map((i) => ({
                        color: i.color,
                        icon: i.icon,
                        isTop: i.isTop,
                        value: i.value,
                      })) ?? []
                    }
                    specialAttributes={
                      item.specificAttributes?.map((i) => ({
                        color: i.color,
                        icon: i.icon,
                        valueTitle: i.valueTitle,
                      })) ?? []
                    }
                  />
                </Stack>
              </Stack>
            </Grid>
            <Grid item sm={1} xs={3}>
              <Stack justifyContent="space-between">
                <VendorPrice
                  currency={item.currency ?? ''}
                  oldPrice={item.orginalPrice}
                  price={item.finalPrice ?? ''}
                  dontShowDiscount
                />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
        <Stack justifyContent="space-between" sx={{ width: { sm: 168, xs: 110 } }}>
          <Stack spacing={2} alignItems="center">
            <Link
              link={productDetailRoute({
                slug: item?.slug,
                hsin: item?.hsin,
              })}
            >
              <ImageShow
                type="product"
                height={isSmall ? 80 : 100}
                width={isSmall ? 80 : 100}
                layout="fill"
                src={item.imageUrl ?? ''}
                objectFit="contain"
                objectPosition="center"
              />
            </Link>

            <AddToCartButton
              productId={item.productId!}
              vendorId={vendorId}
              dontShowText
              maximumOrder={item.orderAndInventorySetting?.maximalPerOrder}
              coefficient={item.orderAndInventorySetting?.multiplesOrder ?? 1}
              inventory={getInventory}
              sx={{ alignItems: 'center' }}
            />
          </Stack>
        </Stack>
      </Stack>
      {notifications?.map((notification) => (
        <BuyNotification
          key={`${notification.type}-${notification.shoppingCartItemId}`}
          used="full-page"
          {...notification}
          productId={item.productId}
          vendorId={vendorId}
        />
      ))}
    </>
  )
}

export default ByVendorItem
