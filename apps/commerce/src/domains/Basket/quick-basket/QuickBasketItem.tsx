import { AttributeHandler, HBLink, ImageShow, VendorPrice } from '@hasty-bazar-commerce/components'
import { AddToCartButton } from '@hasty-bazar-commerce/containers'
import { BasketItemDto, NotificationDto } from '@hasty-bazar-commerce/services/saleApi.generated'
import { Box, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { BuyNotification } from '../components'

export interface IQuickBasketItemProps {
  item: BasketItemDto
  notifications?: NotificationDto[]
  vendorId: string
}

const QuickBasketItem: FC<IQuickBasketItemProps> = (props) => {
  const { item, notifications, vendorId } = props

  return (
    <>
      <Stack direction="row-reverse" justifyContent="space-between" spacing={4}>
        <Stack justifyContent="space-between" sx={{ flex: 1 }}>
          <Stack spacing={4}>
            <HBLink
              target="_blank"
              sx={{ color: 'text.primary', textDecoration: 'none' }}
              href={`/product/${item.hsin}/${item.slug}`}
            >
              <Typography variant="subtitle2">{item.productName}</Typography>
            </HBLink>
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
          <VendorPrice
            currency={item.currency ?? ''}
            oldPrice={item.orginalPrice ?? ''}
            price={item.finalPrice ?? ''}
            dontShowDiscount
          />
        </Stack>
        <Stack justifyContent="space-between" sx={{ width: 168 }}>
          <Stack spacing={2} alignItems="center">
            <HBLink
              target="_blank"
              sx={{ color: 'text.primary', textDecoration: 'none' }}
              href={`/product/${item.hsin}/${item.slug}`}
            >
              <ImageShow
                type="product"
                height={108}
                width={108}
                layout="fill"
                src={item.imageUrl ?? ''}
                objectFit="contain"
                objectPosition="center"
              />
            </HBLink>
            {/* {campagin && (
              <Typography variant="body1" color="error.main">
                {campagin}
              </Typography>
            )} */}

            <Box sx={{ height: 22 }} />

            <AddToCartButton
              sx={{ alignItems: 'center' }}
              productId={item.productId ?? ''}
              vendorId={vendorId}
              dontShowText
              maximumOrder={item?.orderAndInventorySetting?.maximalPerOrder ?? null}
              coefficient={item?.orderAndInventorySetting?.multiplesOrder ?? 1}
              inventory={item.avaliableCount ?? 0}
            />
          </Stack>
        </Stack>
      </Stack>
      {notifications?.map((notification) => (
        <BuyNotification
          key={`quick-basket-${notification.vendorId}`}
          used="quick-basket"
          {...notification}
        />
      ))}
    </>
  )
}

export default QuickBasketItem
