import HBTextFieldController from '@hasty-bazar-commerce/components/HBTextFieldController'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import OrderTrackingMessages from '../../../orderTracking.messages'
import { IRefundForm } from '../RefundCard'

interface ICancelConsignmentReasonSelectProps {
  onChange?: (value: string) => void
  readOnly?: boolean
}

const RefundComplaint: FC<ICancelConsignmentReasonSelectProps> = (props) => {
  const { onChange, readOnly = false } = props
  const { formatMessage } = useIntl()
  const { watch } = useFormContext<IRefundForm>()

  useEffect(() => {
    if (onChange) onChange(watch('complain'))
  }, [watch('complain')])

  return (
    <HBTextFieldController
      name="complain"
      size="small"
      fullWidth
      required
      label={formatMessage({ ...OrderTrackingMessages.refundComplaint })}
      variant="outlined"
      InputProps={{ readOnly }}
      disabled={readOnly}
      formRules={{ required: true }}
    />
  )
}

export default RefundComplaint
