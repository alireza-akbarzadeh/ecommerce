import { HBAutocompleteController } from '@hasty-bazar/core'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import ProductGroupPageMessages from '../../ProductGroupPage.messages'
import { SelectDataType } from '../ProductFurtherDetails'

type Props = {
  disabled?: boolean
  data: SelectDataType[]
}

export default function CommissionLaw({ disabled, data = [] }: Props) {
  const { formatMessage } = useIntl()
  const [openCommisionLawId, setOpenCommisionLawId] = useState<boolean>(false)

  return (
    <HBAutocompleteController
      autoCompleteProps={{
        disabled,
        fullWidth: true,
        onClose: () => setOpenCommisionLawId(false),
        onOpen: () => setOpenCommisionLawId(true),
        open: openCommisionLawId,
      }}
      label={formatMessage(ProductGroupPageMessages.commisionLaw)}
      fieldName={'commisionLawId'}
      isOptionEqualToValue={(o, v) => o?.value == v?.value}
      getOptionLabel={(option) => `${option.title}`}
      options={data}
    />
  )
}
