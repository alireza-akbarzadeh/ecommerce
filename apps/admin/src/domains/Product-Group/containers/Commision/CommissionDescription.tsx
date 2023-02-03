import { HBFormItemTextField } from '@hasty-bazar/core'
import { useIntl } from 'react-intl'
import ProductGroupPageMessages from '../../ProductGroupPage.messages'

type Props = {
  disabled?: boolean
}

export default function CommissionDescription({ disabled }: Props) {
  const { formatMessage } = useIntl()

  return (
    <HBFormItemTextField
      type="text"
      multiline={true}
      disabled={disabled}
      fullWidth
      label={formatMessage(ProductGroupPageMessages.commissionDescription)}
      formName={'commissionDescription'}
    />
  )
}
