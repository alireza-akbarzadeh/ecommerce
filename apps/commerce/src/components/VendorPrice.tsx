import BasketMessages from '@hasty-bazar-commerce/domains/Basket/basket.messages'
import { Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import ProductionDetailMessages from '../domains/ProductDetail/productDetail.messages'

interface IVendorPriceProps {
  price: number | string
  oldPrice?: number | string | null
  discount?: number | null
  currency: string | null
  justifyContent?: 'flex-end' | 'flex-start' | 'center'
  dontShowDiscount?: boolean
}

const VendorPrice: FC<IVendorPriceProps> = (props) => {
  const { oldPrice, price, currency, justifyContent, dontShowDiscount = false, discount } = props

  return (
    <Stack spacing={1}>
      {!!oldPrice && oldPrice !== price && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          justifyContent={justifyContent ?? 'flex-end'}
        >
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ textDecoration: 'line-through' }}
          >
            <FormattedMessage
              {...BasketMessages.priceWithCurrency}
              values={{
                price: Number(oldPrice)?.toLocaleString()!,
                currency,
              }}
            />
          </Typography>
          {!dontShowDiscount && !!discount && (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ backgroundColor: 'error.main', borderRadius: 2 }}
              p={1}
            >
              <Typography variant="overline" color="common.white">
                <FormattedMessage
                  {...ProductionDetailMessages.priceDiscount}
                  values={{
                    discount,
                  }}
                />
              </Typography>
            </Stack>
          )}
        </Stack>
      )}

      <Stack
        spacing={0.5}
        direction="row"
        alignItems="center"
        justifyContent={justifyContent ?? 'flex-end'}
      >
        <Typography variant="subtitle1">{Number(price).toLocaleString()!}</Typography>
        <Typography variant="subtitle2">{currency}</Typography>
      </Stack>
    </Stack>
  )
}

export default VendorPrice
