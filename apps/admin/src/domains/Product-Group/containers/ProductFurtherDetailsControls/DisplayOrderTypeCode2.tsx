import { HBAutocompleteController } from '@hasty-bazar/core'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import ProductGroupPageMessages from '../../ProductGroupPage.messages'
import { SelectDataType } from '../ProductFurtherDetails'

type Props = {
  disabled?: boolean
  data: SelectDataType[]
}
export default function DisplayOrderTypeCode2({ disabled, data }: Props) {
  const { formatMessage } = useIntl()
  const [openDisplayOrderTypeCode, setOpenDisplayOrderTypeCode] = useState<boolean>(false)

  return (
    <HBAutocompleteController
      autoCompleteProps={{
        disabled,
        fullWidth: true,
        onClose: () => setOpenDisplayOrderTypeCode(false),
        onOpen: () => setOpenDisplayOrderTypeCode(true),
        open: openDisplayOrderTypeCode,
      }}
      label={formatMessage(ProductGroupPageMessages.productOrderBy)}
      fieldName={'displayOrderTypeCode'}
      isOptionEqualToValue={(o, v) => o.value == v?.value}
      getOptionLabel={(option) => `${option.title}`}
      options={data}
    />
  )
}
