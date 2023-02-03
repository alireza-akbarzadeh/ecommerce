import { HBIcon } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { OrderTrackingCommentButton } from '../../containers/Comment'
import ConsignmentText from '../ConsignmentText'
import { IConsignmentCardProps } from './ConsignmentCard'

export interface IConsignmentCardHeaderProps extends Pick<IConsignmentCardProps, 'name' | 'texts'> {
  spacing?: number
  hideCargoName?: boolean
  hideCommentButton?: boolean
  cargoId?: string
  partyId?: string
  shoppingCartId?: string
}

const ConsignmentCardHeader: FC<IConsignmentCardHeaderProps> = (props) => {
  const {
    name,
    texts,
    spacing,
    hideCargoName = false,
    hideCommentButton = false,
    cargoId,
    partyId,
    shoppingCartId,
  } = props
  return (
    <Stack spacing={spacing}>
      {!!name && !hideCargoName && (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <HBIcon type="shoppingBag" size="small" />
            <Typography variant="h6">{name}</Typography>
          </Stack>

          {!hideCommentButton && (
            <OrderTrackingCommentButton
              cargoId={cargoId ?? ''}
              partyId={partyId ?? ''}
              shoppingCartId={shoppingCartId ?? ''}
            />
          )}
        </Stack>
      )}

      {!hideCommentButton && hideCargoName && (
        <Stack direction="row-reverse" justifyContent="space-between">
          <OrderTrackingCommentButton
            cargoId={cargoId ?? ''}
            partyId={partyId ?? ''}
            shoppingCartId={shoppingCartId ?? ''}
          />
        </Stack>
      )}

      {!!texts && texts.length > 0 && (
        <Stack direction={{ sm: 'row', xs: 'column' }} flexWrap="wrap" gap={6}>
          {texts
            .filter((text) => text.value)
            .map((text) => (
              <ConsignmentText key={text.key} firstPart={text.key} secondPart={text.value!} />
            ))}
        </Stack>
      )}
    </Stack>
  )
}

export default ConsignmentCardHeader
