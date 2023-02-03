import { HBDivider } from '@hasty-bazar/core'
import { RadioGroup, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { OrderTrackingDetailWrappers } from '../../OrderTracking.styles'
import AllCancelConsignment from './AllCancelConsignment'
import { useConsignmentCancelationUpdater } from './cancel-actions/CancelationContext'
import SomeCancelConsignment from './SomeCancelConsignment'

type cancelingVariant = 'all' | 'some'

const CancelConsginmentBody: FC = () => {
  const { query } = useRouter()
  const shoppingCartId = query!.profile![2] as string
  const { setAllConsignmentCancelation, setProductConsignmentCancelation } =
    useConsignmentCancelationUpdater()

  const [cancelingVariant, setCancelingVariant] = useState<cancelingVariant>('all')

  const handleChangeDefault = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCancelingVariant((event.target as HTMLInputElement).value as cancelingVariant)
  }

  useEffect(() => {
    switch (cancelingVariant) {
      case 'all':
        setAllConsignmentCancelation({
          shoppingCartId,
          cancelationReason: '',
        })
        break
      case 'some':
        setProductConsignmentCancelation({ canceledProducts: [], shoppingCartId })
        break
      default:
        break
    }
  }, [cancelingVariant])

  return (
    <OrderTrackingDetailWrappers>
      <RadioGroup value={cancelingVariant} onChange={handleChangeDefault}>
        <Stack spacing={12} sx={{ width: '100%' }}>
          <AllCancelConsignment checked={cancelingVariant === 'all'} />

          <HBDivider />

          <SomeCancelConsignment checked={cancelingVariant === 'some'} />
          <HBDivider />
        </Stack>
      </RadioGroup>
    </OrderTrackingDetailWrappers>
  )
}

export default CancelConsginmentBody
