import { HBAutocompleteController } from '@hasty-bazar/core'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import ProductGroupPageMessages from '../../ProductGroupPage.messages'
import { SelectDataType } from '../ProductFurtherDetails'

type Props = {
  disabled?: boolean
  data: SelectDataType[]
}

export default function SellerLimitationTypeCode({ disabled, data }: Props) {
  const { formatMessage } = useIntl()

  const [openSellerLimitationTypeCode, setOpenSellerLimitationTypeCode] = useState<boolean>(false)

  return (
    <HBAutocompleteController
      autoCompleteProps={{
        disabled,
        fullWidth: true,
        onClose: () => setOpenSellerLimitationTypeCode(false),
        onOpen: () => setOpenSellerLimitationTypeCode(true),
        open: openSellerLimitationTypeCode,
      }}
      label={formatMessage(ProductGroupPageMessages.sellerLimitation)}
      fieldName={'sellerLimitationTypeCode'}
      isOptionEqualToValue={(o, v) => o.value == v?.value}
      getOptionLabel={(option) => `${option.title}`}
      options={data}
    />
  )
}
