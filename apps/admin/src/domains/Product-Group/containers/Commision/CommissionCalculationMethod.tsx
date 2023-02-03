import { HBAutocompleteController } from '@hasty-bazar/core'
import { AutocompleteChangeDetails, AutocompleteChangeReason } from '@mui/base'
import { ReactNode, SyntheticEvent, useState } from 'react'
import { useIntl } from 'react-intl'
import ProductGroupPageMessages from '../../ProductGroupPage.messages'

export type SelectDataType = {
  title: ReactNode
  value: string | number
  iconPath?: string | undefined
}

type Props = {
  disabled?: boolean
  data: SelectDataType[]
  onChange?:
    | ((
        event: SyntheticEvent<Element, Event>,
        value: SelectDataType | null,
        reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<SelectDataType> | undefined,
      ) => void)
    | undefined
}

export default function CommissionCalculationMethod(props: Props) {
  const { disabled, data, onChange } = props
  const { formatMessage } = useIntl()
  const [open, setOpen] = useState<boolean>(false)
  const handleClose = () => setOpen(false)
  const handleOpen = () => setOpen(true)

  return (
    <HBAutocompleteController
      required
      autoCompleteProps={{
        disabled,
        fullWidth: true,
        onClose: handleClose,
        onOpen: handleOpen,
        open,
        onChange,
      }}
      label={formatMessage(ProductGroupPageMessages.commissionCalculationMethod)}
      fieldName={'commissionCalculationType'}
      isOptionEqualToValue={(o, v) => o.value == v?.value}
      getOptionLabel={(option) => `${option.title}`}
      options={data}
      formRules={{ required: true }}
    />
  )
}
