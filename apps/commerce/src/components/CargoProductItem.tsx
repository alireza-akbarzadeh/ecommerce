import {
  AttributeHandler,
  HBLink,
  ImageShow,
  TextWithHBIcon,
  VendorPrice,
} from '@hasty-bazar-commerce/components'
import { ProductBundleDto } from '@hasty-bazar-commerce/services/saleApi.generated'
import { Box, Stack, Typography } from '@mui/material'
import { FC, PropsWithChildren } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import ComponentsMessages from './Components.message'
interface ICargoProductItem {
  productCartItem: ProductBundleDto
  withAttributes?: boolean
  isPayment?: boolean
}
const productDetailRoutePrefix = '/product'

const Link: FC<PropsWithChildren<{ link: string }>> = ({ link, children }) => {
  return (
    <HBLink target="_blank" sx={{ textDecoration: 'none', color: 'text.primary' }} href={link}>
      {children}
    </HBLink>
  )
}

const CargoProductItem: FC<ICargoProductItem> = ({
  productCartItem,
  withAttributes,
  isPayment,
}) => {
  const {
    imageUrl,
    finalPrice,
    originalPrice,
    shoppingCartQuantity,
    productName,
    specificAttributes,
    attribute,
    currency,
    productId,
    productClassId,
    vendor,
  } = productCartItem
  const { formatMessage } = useIntl()

  return (
    <Link link={`${productDetailRoutePrefix}/${productId}/${productName?.replace(/ /g, '-')}`}>
      <Stack spacing={4}>
        <Stack spacing={4} direction="row" alignItems="flex-end">
          <Box
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <ImageShow
              width={100}
              height={100}
              type="product"
              layout="fill"
              objectFit="contain"
              objectPosition="center"
              src={imageUrl ?? ''}
            />
          </Box>
          <Stack>
            <VendorPrice
              currency={currency ?? ''}
              oldPrice={originalPrice}
              price={finalPrice ?? ''}
              justifyContent="flex-start"
            />
            <Typography variant="h6">
              <FormattedMessage
                {...ComponentsMessages.cargoItemQuantity}
                values={{ count: Number(shoppingCartQuantity).toLocaleString() }}
              />
            </Typography>
            {isPayment && vendor?.storeName && (
              <TextWithHBIcon
                customVariant="subtitle2"
                text={vendor?.storeName}
                size="small"
                iconType="store"
                textColor="text.primary"
              />
            )}
          </Stack>
        </Stack>
        <Typography variant="subtitle2">{productName}</Typography>
        {withAttributes && (
          <Stack spacing={2}>
            <AttributeHandler
              attributes={
                attribute?.map((i) => ({
                  color: i.color,
                  icon: i.icon,
                  isTop: i.isTop,
                  value: i.value,
                })) ?? []
              }
              specialAttributes={
                specificAttributes?.map((i) => ({
                  color: i.color,
                  icon: i.icon,
                  valueTitle: i.valueTitle,
                })) ?? []
              }
            />
            {!!vendor?.storeName && (
              <TextWithHBIcon
                customVariant="subtitle2"
                text={vendor?.storeName}
                size="small"
                iconType="store"
                textColor="text.primary"
              />
            )}
          </Stack>
        )}
      </Stack>
    </Link>
  )
}

export default CargoProductItem
