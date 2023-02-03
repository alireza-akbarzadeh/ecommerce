import HBNumericFieldController from '@hasty-bazar/admin-shared/containers/HBNumericFieldController'
import { useIntl } from 'react-intl'
import ProductGroupPageMessages from '../../ProductGroupPage.messages'

type Props = {
  disabled?: boolean
}

export default function CommissionMaximum({ disabled }: Props) {
  const { formatMessage } = useIntl()

  return (
    <HBNumericFieldController
      disabled={disabled}
      fullWidth
      label={formatMessage(ProductGroupPageMessages.commissionMaximum)}
      name={'maximumCommission'}
      formRules={{
        required: false,
      }}
    />
  )
}
