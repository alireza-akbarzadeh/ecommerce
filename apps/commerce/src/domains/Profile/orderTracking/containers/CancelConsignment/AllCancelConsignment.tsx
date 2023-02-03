import { HBRadioButton } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { ConsignmentCardProducts } from '../../components'
import OrderTrackingMessages from '../../orderTracking.messages'
import { CancelConsignmentResultWrapper } from '../../OrderTracking.styles'
import {
  useConsignmentCancelation,
  useConsignmentCancelationUpdater,
} from './cancel-actions/CancelationContext'
import CancelConsignmentReasonSelect from './CancelConsignmentReasonSelect'

interface IAllCancelConsignmentProps {
  checked: boolean
}

const AllCancelConsignment: FC<IAllCancelConsignmentProps> = (props) => {
  const { checked } = props
  const { products, allCancelation } = useConsignmentCancelation()
  const { setAllConsignmentCancelation } = useConsignmentCancelationUpdater()

  return (
    <Stack spacing={6} sx={{ width: '100%' }}>
      <Stack direction="row" alignItems="center" spacing={4}>
        <HBRadioButton value="all" checked={checked} sx={{ height: 'fit-content', p: 0 }} />

        <Typography variant="h6" color="text.primary">
          <FormattedMessage {...OrderTrackingMessages.cancelAllConsignments} />
        </Typography>
      </Stack>
      {checked && (
        <>
          <ConsignmentCardProducts
            items={products.map((product) => {
              return {
                count: product.quantity!,
                src: product.productDefaultImage,
                productClassId: product.productClassId ?? '',
                productId: product.productId ?? '',
                productName: product.productName,
              }
            })}
          />

          <CancelConsignmentResultWrapper>
            <CancelConsignmentReasonSelect
              cancelReason={allCancelation?.cancelationReason}
              onChange={(value) =>
                setAllConsignmentCancelation({
                  shoppingCartId: allCancelation?.shoppingCartId ?? '',
                  cancelationReason: value,
                })
              }
            />
          </CancelConsignmentResultWrapper>
        </>
      )}
    </Stack>
  )
}

export default AllCancelConsignment
