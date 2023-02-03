import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import React from 'react'
import { useIntl } from 'react-intl'
import ProductGroupPageMessages from '../../ProductGroupPage.messages'

export default function DisplayOrderTypeCode() {
  const { formatMessage } = useIntl()
  return (
    <HBTextFieldController
      fullWidth
      label={formatMessage(ProductGroupPageMessages.displayOrderInGruop)}
      name={'displaySortTypeCode'}
      formRules={{
        required: true,
      }}
      required
    />
  )
}
