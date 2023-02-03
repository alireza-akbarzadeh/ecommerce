import { HBDivider } from '@hasty-bazar/core'
import { RadioGroup, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { OrderTrackingDetailWrappers } from '../../OrderTracking.styles'
import AllRefund from './AllRefund'
import ProductRefund from './ProductRefund'
import { setAllRefundationInitialValue, useRefundUpdater } from './RefundContext'

type cancelingVariant = 'all' | 'some'

const RefundBody: FC = () => {
  const { query } = useRouter()
  const orderId = query!.profile![2] as string
  const { setAllRefundation, setProductRefundation } = useRefundUpdater()

  const [cancelingVariant, setCancelingVariant] = useState<cancelingVariant>('all')

  const handleChangeDefault = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCancelingVariant((event.target as HTMLInputElement).value as cancelingVariant)
  }

  useEffect(() => {
    switch (cancelingVariant) {
      case 'all':
        setAllRefundation(setAllRefundationInitialValue(orderId))
        break
      case 'some':
        setProductRefundation({ refundedProducts: [], orderId })
        break
      default:
        break
    }
  }, [cancelingVariant])

  return (
    <OrderTrackingDetailWrappers>
      <RadioGroup value={cancelingVariant} onChange={handleChangeDefault}>
        <Stack spacing={12} sx={{ width: '100%' }}>
          <AllRefund checked={cancelingVariant === 'all'} />

          <HBDivider />

          <ProductRefund checked={cancelingVariant === 'some'} />
          <HBDivider />
        </Stack>
      </RadioGroup>
    </OrderTrackingDetailWrappers>
  )
}

export default RefundBody
