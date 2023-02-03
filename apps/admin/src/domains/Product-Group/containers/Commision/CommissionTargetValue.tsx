import HBNumericFieldController from '@hasty-bazar/admin-shared/containers/HBNumericFieldController'
import { useIntl } from 'react-intl'
import ProductGroupPageMessages from '../../ProductGroupPage.messages'

type Props = {
  disabled?: boolean
  max: {
    value: string | number
    message: string
  }
}

export default function CommissionTargetValue({ disabled, max }: Props) {
  const { formatMessage } = useIntl()

  return (
    <HBNumericFieldController
      required
      disabled={disabled}
      fullWidth
      label={formatMessage(ProductGroupPageMessages.commissionTargetValue)}
      name={'commissionTargetValue'}
      formRules={{
        required: {
          value: true,
          message: formatMessage(ProductGroupPageMessages.commissionTargetRequired),
        },
        min: {
          value: 0,
          message: formatMessage(ProductGroupPageMessages.commissionTargetValueMin),
        },
        ...(max ? { max } : {}),
      }}
    />
  )
}
