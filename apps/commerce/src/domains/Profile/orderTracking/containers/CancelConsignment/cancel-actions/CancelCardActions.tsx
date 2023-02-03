import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { CancelConsignmentResultWrapper } from '../../../OrderTracking.styles'

import { ICancelForm } from '../CancelConsignmentCard'
import { IcanceledProduct } from './CancelationContext'
import CancelCount from './CancelCount'
import CancelReasonSelect from './CancelReasonSelect'

interface IRefundCardActions {
  readOnly?: boolean
  product: IcanceledProduct
  updateItem?: (item: IcanceledProduct) => void
}

const CancelCardActions: FC<IRefundCardActions> = ({ readOnly, product, updateItem }) => {
  const {
    formState: { isValid },
    getValues,
  } = useFormContext<ICancelForm>()
  const reasonChanged = (reason: string) => {
    if (!updateItem) return
    updateItem({ ...product, cancelationReason: reason })
  }

  const updateCount = (count: number) => {
    if (!updateItem) return
    updateItem({
      ...product,
      count,
      cancelationReason: getValues('reason'),
      formValidation: isValid,
    })
  }

  useEffect(() => {
    if (!updateItem) return
    updateItem({
      ...product,
      formValidation: isValid,
      count: +getValues('count'),
      cancelationReason: getValues('reason'),
    })
  }, [isValid])

  return (
    <CancelConsignmentResultWrapper spacing={4}>
      <CancelReasonSelect readOnly={readOnly} onChange={reasonChanged} />
      <CancelCount quantity={product.quantity} onChange={updateCount} readOnly={readOnly} />
    </CancelConsignmentResultWrapper>
  )
}

export default CancelCardActions
