import { HBFormItemTextField } from '@hasty-bazar/core'
import { useIntl } from 'react-intl'
import ProductGroupPageMessages from '../../ProductGroupPage.messages'

type Props = {
  disabled?: boolean
}

export default function CommissionNumberOfSettlementDays({ disabled }: Props) {
  const { formatMessage } = useIntl()

  return (
    <HBFormItemTextField
      required
      type="number"
      disabled={disabled}
      fullWidth
      label={formatMessage(ProductGroupPageMessages.commissionNumberOfSettlementDays)}
      formName={'commissionSettlementDays'}
      rules={{
        required: {
          value: true,
          message: formatMessage(ProductGroupPageMessages.commissionNumberOfSettlementDays),
        },
        min: 1,
        max: 365,
      }}
    />
  )
}
