import { HBDivider, HBRadioButton } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import OrderTrackingMessages from '../../orderTracking.messages'
import {
  IcanceledProduct,
  useConsignmentCancelation,
  useConsignmentCancelationUpdater,
} from './cancel-actions/CancelationContext'
import CancelConsignmentCard from './CancelConsignmentCard'

interface ISomeCancelConsignmentProps {
  checked: boolean
}

export interface ISomeCancelSonsignments {
  id: string
  canceledCount: number
  reason: string
}

const SomeCancelConsignment: FC<ISomeCancelConsignmentProps> = (props) => {
  const { checked } = props
  const { products, productCancelations } = useConsignmentCancelation()
  const { setProductConsignmentCancelation } = useConsignmentCancelationUpdater()

  const handleCheckBox = (lastSelectedValue: boolean, item: IcanceledProduct) => {
    if (lastSelectedValue) {
      setProductConsignmentCancelation({
        shoppingCartId: productCancelations?.shoppingCartId!,
        canceledProducts: [
          ...productCancelations!.canceledProducts!.filter((i) => i.productId !== item.productId),
        ],
      })
    } else {
      setProductConsignmentCancelation({
        shoppingCartId: productCancelations?.shoppingCartId!,
        canceledProducts: [...productCancelations!.canceledProducts!, item],
      })
    }
  }

  const handleSelectedChanged = (item: IcanceledProduct) => {
    const tempSelecteds = [...(productCancelations?.canceledProducts ?? [])]
    tempSelecteds[tempSelecteds.findIndex((i) => i.productId === item.productId)] = { ...item }
    setProductConsignmentCancelation({
      shoppingCartId: productCancelations?.shoppingCartId!,
      canceledProducts: [...tempSelecteds],
    })
  }

  return (
    <Stack spacing={6} sx={{ width: '100%' }}>
      <Stack direction="row" alignItems="center" spacing={4}>
        <HBRadioButton value="some" checked={checked} sx={{ height: 'fit-content', p: 0 }} />

        <Typography variant="h6" color="text.primary">
          <FormattedMessage {...OrderTrackingMessages.cancelSomeConsignments} />
        </Typography>
      </Stack>
      <Box />
      {checked && (
        <>
          {products.map((item) => (
            <>
              <CancelConsignmentCard
                key={`some-cancel-consignment-${item.productId}`}
                item={item}
                checkedCallBack={handleCheckBox}
                isSelected={productCancelations?.canceledProducts.some(
                  (i) => i.productId === item.productId,
                )}
                updateItem={handleSelectedChanged}
              />
              <HBDivider sx={{ borderColor: 'grey.200' }} />
            </>
          ))}
        </>
      )}
    </Stack>
  )
}

export default SomeCancelConsignment
