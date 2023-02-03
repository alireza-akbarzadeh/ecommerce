import useBasketMethods from '@hasty-bazar-commerce/core/hook/useBasketMethods'
import ProductionDetailMessages from '@hasty-bazar-commerce/domains/ProductDetail/productDetail.messages'
import { HBButton, HBIcon, HBIconButton } from '@hasty-bazar/core'
import { Stack, styled, SxProps, Theme, Typography, useMediaQuery } from '@mui/material'
import Link from 'next/link'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'

interface IAddToCartButtonProps {
  dontShowText?: boolean
  productId: string
  vendorId: string
  maximumOrder?: number | null
  coefficient: number
  sx?: SxProps
  inventory: number
}

const HBIconButtonStyle = styled(HBIconButton)(({ theme }) => ({
  minWidth: 'auto',
  padding: 0,
  border: 'none',
}))

const AddToCartButton: FC<IAddToCartButtonProps> = (props) => {
  const breakpointDownSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const {
    dontShowText = false,
    productId,
    vendorId,
    maximumOrder: maximum,
    coefficient,
    inventory,
  } = props

  const {
    addToBasket,
    addingLoading,
    count,
    handleMinus,
    product,
    decreasingLoading,
    minimaloading,
  } = useBasketMethods({
    productId,
    coefficient,
    vendorId,
  })

  return (
    <Stack
      sx={{ width: '100%', ...props.sx }}
      spacing={4}
      alignItems={!dontShowText ? 'flex-start' : 'center'}
    >
      {count > 0 && !!inventory && (
        <Stack
          className="plus-count-wrapper"
          alignItems="center"
          direction="row"
          spacing={6}
          sx={{ width: '100%' }}
        >
          <Stack
            direction="row"
            sx={{
              width: { xs: maximum === count ? 'auto' : 116, sm: '100%' },
              maxWidth: 168,
              height: 55,
              bgcolor: 'grey.100',
              borderRadius: 2,
              px: 2,
            }}
            justifyContent="center"
            spacing={7}
            alignItems="center"
          >
            <HBIconButtonStyle
              disabled={maximum === count || minimaloading}
              onClick={addToBasket}
              sx={{ backgroundColor: 'inherit!important' }}
              icon={
                <HBIcon
                  type="plus"
                  size="small"
                  sx={{ color: maximum !== count ? 'primary.main' : 'grey.300' }}
                />
              }
            />
            <Stack alignItems="center">
              <Typography variant="subtitle1" color="primary.main">
                {`${product?.shoppingCartQuantity}`}
              </Typography>
              {maximum === count && (
                <Typography color="text.secondary" variant="caption">
                  <FormattedMessage {...ProductionDetailMessages.maximum} />
                </Typography>
              )}
            </Stack>

            <HBIconButtonStyle
              onClick={handleMinus}
              sx={{ backgroundColor: 'inherit!important' }}
              icon={
                <HBIcon
                  type={count > coefficient ? 'minus' : 'trashAlt'}
                  size="small"
                  sx={{ color: 'primary.main' }}
                />
              }
              disabled={minimaloading}
            />
          </Stack>
          {!dontShowText && (
            <Stack justifyContent="space-between" spacing={2.5}>
              <Link href="/basket">
                <Typography sx={{ cursor: 'pointer' }} variant="button" color="primary.main">
                  <FormattedMessage {...ProductionDetailMessages.seeBasket} />
                </Typography>
              </Link>
            </Stack>
          )}
        </Stack>
      )}

      {inventory ? (
        <>
          {count === 0 && inventory && (
            <HBButton
              loading={addingLoading || decreasingLoading || minimaloading}
              fullWidth
              onClick={addToBasket}
            >
              <Typography variant={!breakpointDownSm ? 'button' : 'caption'}>
                <FormattedMessage {...ProductionDetailMessages.addToCart} />
              </Typography>
            </HBButton>
          )}
          {coefficient > 1 && !dontShowText && (
            <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
              <HBIcon size="small" type="documentInfo" />
              <Typography variant={breakpointDownSm ? 'subtitle2' : 'body1'}>
                <FormattedMessage
                  {...ProductionDetailMessages.productOrderCount}
                  values={{ count: coefficient }}
                />
              </Typography>
            </Stack>
          )}
        </>
      ) : (
        <HBButton disabled fullWidth>
          <FormattedMessage {...ProductionDetailMessages.unavailable} />
        </HBButton>
      )}
    </Stack>
  )
}

export default AddToCartButton
