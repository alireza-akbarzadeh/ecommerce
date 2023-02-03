import {
  HBLink,
  Rate,
  SippingVisuality,
  TextWithHBIcon,
  TextWithIcon,
} from '@hasty-bazar-commerce/components'
import { AddToCartButton } from '@hasty-bazar-commerce/containers'
import {
  GetAllFavoriteProductsQueryResult,
  ProductPriceTiering,
} from '@hasty-bazar-commerce/services/catalogApi.generated'
import { Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import FavoriteMessages from '../favorite.messages'

interface IFavoriteCardInformationProps
  extends Pick<
      GetAllFavoriteProductsQueryResult,
      | 'productName'
      | 'vendor'
      | 'vendorSatisfication'
      | 'soldCountDto'
      | 'remainingCount'
      | 'shippingObligation'
      | 'shippingCost'
      | 'productClassId'
      | 'productId'
      | 'orderAndInventorySettingDto'
      | 'vendorRate'
      | 'currency'
      | 'hsin'
      | 'slug'
    >,
    ProductPriceTiering {
  discount: string
  vendorId: string
  maximumOrder: number | null
  coefficient: number
  inventory: number
}

const iconSize = 24

const FavoriteCardInformation: FC<IFavoriteCardInformationProps> = (props) => {
  const {
    productName,
    remainingCount,
    shippingCost,
    shippingObligation,
    soldCountDto,
    vendor,
    vendorSatisfication,
    productId,
    orderAndInventorySettingDto,
    discount,
    priceBeforeTiering,
    originalPrice,
    vendorRate,
    vendorId,
    maximumOrder,
    coefficient,
    inventory,
    currency,
    hsin,
    slug,
  } = props
  const { formatMessage } = useIntl()
  return (
    <Stack spacing={2} justifyContent="space-between" sx={{ flex: 1 }}>
      <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="flex-end">
        <HBLink
          sx={{ color: 'text.primary', textDecoration: 'none' }}
          href={`/product/${hsin}/${slug}`}
          target="_blank"
        >
          <Typography color="text.primary" variant="subtitle1">
            {productName}
          </Typography>
        </HBLink>
        <Stack direction="row" spacing={4} alignItems="center" justifyContent="flex-end">
          {!!discount && (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ backgroundColor: 'error.main', borderRadius: 2 }}
              p={1}
            >
              <Typography variant="overline" color="common.white">
                <FormattedMessage {...FavoriteMessages.priceDiscount} values={{ discount }} />
              </Typography>
            </Stack>
          )}

          {!!priceBeforeTiering && (
            <Stack spacing={0.5} direction="row" alignItems="center" justifyContent="flex-end">
              <Typography variant="h6">{priceBeforeTiering?.toLocaleString()}</Typography>
              <Typography variant="subtitle2">{currency}</Typography>
            </Stack>
          )}
        </Stack>
      </Stack>

      <Stack spacing={2}>
        {!!vendor?.storeName && (
          <Stack direction="row" justifyContent="space-between">
            {vendor?.icon ? (
              <TextWithIcon
                sx={{ color: 'grey.900' }}
                icon={`${process.env.NEXT_PUBLIC_CDN}${vendor.icon}`}
                text={vendor.storeName ?? ''}
                size={iconSize}
                spacing={2}
              />
            ) : (
              <TextWithHBIcon
                textColor="grey.900"
                iconColor="grey.700"
                iconType="shop"
                text={vendor?.storeName}
              />
            )}
            {!!discount && !!originalPrice && (
              <Stack alignItems="flex-end">
                <Typography
                  variant="subtitle1"
                  color="grey.500"
                  sx={{ textDecoration: 'line-through' }}
                >
                  <FormattedMessage
                    {...FavoriteMessages.priceWithCurrency}
                    values={{
                      price: originalPrice.toLocaleString(),
                      currency,
                    }}
                  />
                </Typography>
              </Stack>
            )}
          </Stack>
        )}

        <Stack direction="row" justifyContent="space-between">
          {!!vendorSatisfication?.icon && vendorSatisfication.value && (
            <TextWithIcon
              sx={{ color: 'grey.900' }}
              icon={`${process.env.NEXT_PUBLIC_CDN}${vendorSatisfication.icon}`}
              text={formatMessage(FavoriteMessages.vendorSatisficationWithValue, {
                value: vendorSatisfication.value,
              })}
              size={iconSize}
              spacing={2}
            />
          )}
          {!!vendorRate?.value && !!vendorRate?.count && (
            <Stack alignItems="flex-end">
              <Rate
                count={vendorRate?.count ? vendorRate.count.toString() : ''}
                value={vendorRate?.value ? vendorRate.value.toString() : ''}
              />
            </Stack>
          )}
        </Stack>

        {!vendorSatisfication?.icon && !!vendorSatisfication?.value && (
          <TextWithHBIcon
            textColor="grey.900"
            iconColor="grey.700"
            iconType="thumbsUp"
            text={formatMessage(FavoriteMessages.vendorSatisficationWithValue, {
              value: vendorSatisfication.value,
            })}
          />
        )}

        {!!soldCountDto?.icon && !!soldCountDto.value && (
          <TextWithIcon
            sx={{ color: 'grey.900' }}
            icon={`${process.env.NEXT_PUBLIC_CDN}${soldCountDto?.icon}`}
            text={formatMessage(FavoriteMessages.soldCount, {
              count: soldCountDto.value,
            })}
            size={iconSize}
            spacing={2}
          />
        )}

        {!!soldCountDto?.value && !soldCountDto?.icon && (
          <TextWithHBIcon
            textColor="grey.900"
            iconColor="grey.700"
            iconType="tag"
            text={formatMessage(FavoriteMessages.soldCount, {
              count: soldCountDto.value,
            })}
          />
        )}

        {!!remainingCount?.icon &&
          !!remainingCount.value &&
          remainingCount.value <=
            (orderAndInventorySettingDto?.numberForShowCountInventory ?? 0) && (
            <TextWithIcon
              sx={{ color: 'error.main' }}
              icon={`${process.env.NEXT_PUBLIC_CDN}${remainingCount?.icon}`}
              text={formatMessage(FavoriteMessages.remainingCount, {
                count: remainingCount.value,
              })}
              size={iconSize}
              spacing={2}
            />
          )}

        {!remainingCount?.icon && !!remainingCount?.value && (
          <TextWithHBIcon
            textColor="error.main"
            iconColor="error.main"
            iconType="exclamationOctagon"
            text={formatMessage(FavoriteMessages.remainingCount, {
              count: remainingCount.value,
            })}
          />
        )}

        <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="flex-end">
          <Stack
            direction="row"
            alignItems="center"
            gap={2}
            flexWrap="wrap"
            sx={{ flex: 1, height: '100%', alignSelf: 'flex-start' }}
          >
            {!!shippingObligation?.value && (
              <SippingVisuality image="/assets/svg/box-clock.svg" text={shippingObligation.value} />
            )}

            {!!shippingCost?.value && (
              <SippingVisuality image="/assets/svg/box-arrow.svg" text={shippingCost.value} />
            )}
          </Stack>
          <Stack alignItems="center" sx={{ width: 168 }}>
            <AddToCartButton
              sx={{
                flex: 1,
                '& .plus-count-wrapper': { justifyContent: 'flex-end' },
              }}
              dontShowText
              productId={productId!}
              vendorId={vendorId}
              maximumOrder={maximumOrder}
              coefficient={coefficient ?? 1}
              inventory={inventory}
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default FavoriteCardInformation
