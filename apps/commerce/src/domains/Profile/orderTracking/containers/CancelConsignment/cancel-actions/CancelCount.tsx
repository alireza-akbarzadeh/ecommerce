import { HBTextFieldController } from '@hasty-bazar/auth'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import OrderTrackingMessages from '../../../orderTracking.messages'
import { IRefundForm } from '../../refund/RefundCard'

interface ICancelCountProps {
  onChange?: (value: number) => void
  readOnly?: boolean
  quantity: number
}

const CancelCount: FC<ICancelCountProps> = (props) => {
  const { onChange, readOnly = false, quantity } = props
  const { formatMessage } = useIntl()
  const { watch } = useFormContext<IRefundForm>()

  useEffect(() => {
    if (onChange) onChange(+watch('count'))
  }, [watch('count')])

  return (
    <HBTextFieldController
      name="count"
      size="small"
      fullWidth
      required
      label={formatMessage({ ...OrderTrackingMessages.canceledCount })}
      variant="outlined"
      InputProps={{ readOnly }}
      disabled={readOnly}
      formRules={{
        validate: (value) => (!+value || +value > quantity || +value < 0 ? false : true),
        required: true,
      }}
      type="number"
    />
  )
}

export default CancelCount
