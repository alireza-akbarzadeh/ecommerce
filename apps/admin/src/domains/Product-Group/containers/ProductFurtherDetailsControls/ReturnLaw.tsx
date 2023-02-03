import { HBAutocompleteController } from '@hasty-bazar/core'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import ProductGroupPageMessages from '../../ProductGroupPage.messages'
import { SelectDataType } from '../ProductFurtherDetails'

type Props = {
  disabled: boolean
  data: SelectDataType[]
}

export default function ReturnLaw({ disabled, data = [] }: Props) {
  const { formatMessage } = useIntl()
  const [openReturnLawId, setOpenReturnLawId] = useState<boolean>(false)

  return (
    <HBAutocompleteController
      autoCompleteProps={{
        disabled,
        fullWidth: true,
        onClose: () => setOpenReturnLawId(false),
        onOpen: () => setOpenReturnLawId(true),
        open: openReturnLawId,
      }}
      label={formatMessage(ProductGroupPageMessages.returnLaw)}
      fieldName={'returnLawId'}
      isOptionEqualToValue={(o, v) => o.value == v?.value}
      getOptionLabel={(option) => `${option.title}`}
      options={data}
    />
  )
}
