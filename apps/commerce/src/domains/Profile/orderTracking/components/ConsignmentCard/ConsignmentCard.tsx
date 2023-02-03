import { Stack } from '@mui/material'
import { FC } from 'react'
import { ConsginmentCardHeader } from '.'
import ConsignmentCardProducts from './ConsignmentCardProducts'

type ConsignmentCardText = {
  key: string
  value?: string | null
}

export type ConsignmentCardProduct = {
  src?: string | null
  count?: number | null
  productId?: string | null
  productClassId?: string | null
  productName?: string | null
  slug?: string | null
  hsin?: string | null
}

export interface IConsignmentCardProps {
  name?: string
  texts?: ConsignmentCardText[]
  products: ConsignmentCardProduct[]
  cargoId?: string
  partyId?: string
  shoppingCartId?: string
  hideCommentButton?: boolean
  hideHeader?: boolean
}

const ConsignmentCard: FC<IConsignmentCardProps> = (props) => {
  const {
    name,
    texts,
    products,
    cargoId,
    partyId,
    shoppingCartId,
    hideCommentButton = false,
    hideHeader = false,
  } = props
  return (
    <Stack spacing={8}>
      {!hideHeader && (
        <ConsginmentCardHeader
          name={name}
          spacing={8}
          texts={texts}
          cargoId={cargoId ?? ''}
          partyId={partyId ?? ''}
          shoppingCartId={shoppingCartId ?? ''}
          hideCommentButton={hideCommentButton}
        />
      )}

      {products.length > 0 && <ConsignmentCardProducts items={products} />}
    </Stack>
  )
}

export default ConsignmentCard
