import { HBAutoComplete, HBTextField } from '@hasty-bazar/core'
import { AutocompleteChangeDetails, SxProps, Theme } from '@mui/material'
import React from 'react'
import { useIntl } from 'react-intl'
import { MultiSelectDataType } from '../../components/HBMultiSelectController'
import ProductGroupPageMessages from '../../ProductGroupPage.messages'

type Props = {
  disabled?: boolean
  sx?: SxProps<Theme>
  data: MultiSelectDataType[]
  selectedData?: any
  onChange: (
    e: React.SyntheticEvent<Element, Event>,
    selected: {
      value?: number | string
    }[],
    reason?: string,
    details?: AutocompleteChangeDetails<any> | undefined,
  ) => void
}

export default function CategoryAcception({ disabled, onChange, selectedData = [], data }: Props) {
  const { formatMessage } = useIntl()

  return (
    <HBAutoComplete
      options={data.map((item) => ({ value: item.fullCode!, title: item.title! }))}
      getOptionLabel={(option) => `${option.title || option.valueName}`}
      isOptionEqualToValue={(o, v) => o.value == v?.value}
      renderInput={(params) => (
        <HBTextField
          {...params}
          label={formatMessage(ProductGroupPageMessages.categoryAcceptions)}
          disabled={disabled}
          placeholder={''}
        />
      )}
      disabled={disabled}
      fullWidth
      multiple
      filterSelectedOptions
      onChange={onChange}
      defaultValue={selectedData}
    />
  )
}
