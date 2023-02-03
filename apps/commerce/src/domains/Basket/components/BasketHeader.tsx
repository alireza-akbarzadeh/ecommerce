import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import useClientSession from '@hasty-bazar-commerce/core/hook/useClientSession'
import { useDeleteWebSaleBasketByClientSessionIdItemsMutation } from '@hasty-bazar-commerce/Service-Enhancers/BasketApi.enhanced'
import { HBButton, HBIcon } from '@hasty-bazar/core'
import { pxToRem } from '@hasty-bazar/material-provider'
import { Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import BasketMessages from '../basket.messages'

interface IBasketHeaderProps {
  count: number
}

const BasketHeader: FC<IBasketHeaderProps> = (props) => {
  const breakpointDownSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const [removeAllMutation, { isLoading: removeAllLoading }] =
    useDeleteWebSaleBasketByClientSessionIdItemsMutation()

  const clientSessionId = useClientSession()

  const { count } = props
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant={breakpointDownSm ? 'subtitle1' : 'h4'}>
        <FormattedMessage {...BasketMessages.cartWithCount} values={{ count }} />
      </Typography>
      <HBButton
        variant="text"
        onClick={() =>
          removeAllMutation({
            ...ApiConstants,
            clientSessionId: clientSessionId!,
          })
        }
        disableRipple
        sx={{
          color: (theme) => `${theme.palette.info.main}!important`,
          border: 'none!important',
          minWidth: 0,
          py: 0,
        }}
        loading={removeAllLoading}
      >
        <Stack direction="row" alignItems="center" gap={2.25}>
          <HBIcon
            type="trashAlt"
            sx={{
              width: 24,
              height: 24,
              display: 'flex',
              justifyItems: 'center',
              alignItems: 'center',
              fontSize: pxToRem(22.4),
            }}
          />
          <FormattedMessage {...BasketMessages.removeAll} />
        </Stack>
      </HBButton>
    </Stack>
  )
}

export default BasketHeader
