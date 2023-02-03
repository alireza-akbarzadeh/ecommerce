import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { RefundActionWrapper } from '../../../OrderTracking.styles'
import { IRefundForm } from '../RefundCard'
import { IRefundedProduct } from '../RefundContext'
import RefundComplaint from './RefundComplaint'
import RefundCount from './RefundCount'
import RefundFileUploader from './RefundFileUploader'
import RefundReasonSelect from './RefundReasonSelect'

interface IRefundCardActions {
  readOnly?: boolean
  product: IRefundedProduct
  updateItem?: (item: IRefundedProduct) => void
}

const RefundCardActions: FC<IRefundCardActions> = ({ readOnly, product, updateItem }) => {
  const {
    formState: { isValid },
    getValues,
  } = useFormContext<IRefundForm>()
  const reasonChanged = (reason: string) => {
    if (!updateItem) return
    updateItem({ ...product, refundReason: reason })
  }

  const updateComplaint = (complaint: string) => {
    if (!updateItem) return
    updateItem({
      ...product,
      complaint,
      refundedCount: +getValues('count'),
      refundReason: getValues('reason'),
      formValidation: isValid,
    })
  }

  const updateCount = (count: number) => {
    if (!updateItem) return
    updateItem({
      ...product,
      refundedCount: count,
      complaint: getValues('complain'),
      refundReason: getValues('reason'),
      formValidation: isValid,
    })
  }

  useEffect(() => {
    if (!updateItem) return
    updateItem({
      ...product,
      formValidation: isValid,
      complaint: getValues('complain'),
      refundedCount: +getValues('count'),
      refundReason: getValues('reason'),
    })
  }, [isValid])

  return (
    <RefundActionWrapper spacing={4}>
      <RefundReasonSelect readOnly={readOnly} onChange={reasonChanged} />
      <RefundCount quantity={product.quantity} onChange={updateCount} readOnly={readOnly} />
      <RefundComplaint onChange={updateComplaint} readOnly={readOnly} />
      <RefundFileUploader />
    </RefundActionWrapper>
  )
}

export default RefundCardActions
