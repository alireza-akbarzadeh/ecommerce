import { HBAutocompleteController } from '@hasty-bazar/core'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import ProductGroupPageMessages from '../../ProductGroupPage.messages'
import { SelectDataType } from '../ProductFurtherDetails'

type Props = {
  disabled?: boolean
  data: SelectDataType[]
}

export default function ScreenDisplay({ disabled, data = [] }: Props) {
  const { formatMessage } = useIntl()
  const [openScreenDisplayId, setOpenScreenDisplayId] = useState<boolean>(false)

  return (
    <HBAutocompleteController
      autoCompleteProps={{
        disabled,
        fullWidth: true,
        onClose: () => setOpenScreenDisplayId(false),
        onOpen: () => setOpenScreenDisplayId(true),
        open: openScreenDisplayId,
      }}
      label={formatMessage(ProductGroupPageMessages.screenDisplay)}
      fieldName={'screenDisplayId'}
      isOptionEqualToValue={(o, v) => o.value == v?.value}
      getOptionLabel={(option) => `${option.title}`}
      options={data}
    />
  )
}
