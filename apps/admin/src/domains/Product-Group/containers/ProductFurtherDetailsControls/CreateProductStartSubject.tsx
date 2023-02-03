import { HBFormItemTextField } from '@hasty-bazar/core'
import React from 'react'
import { useIntl } from 'react-intl'
import ProductGroupPageMessages from '../../ProductGroupPage.messages'

type Props = {
  disabled?: boolean
}

export default function CreateProductStartSubject({ disabled }: Props) {
  const { formatMessage } = useIntl()

  return (
    <HBFormItemTextField
      disabled={disabled}
      fullWidth
      label={formatMessage(ProductGroupPageMessages.createProductStartSubject)}
      formName={'createProductStartSubject'}
    />
  )
}
