import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { HBAutocompleteController, HBIcon } from '@hasty-bazar/core'
import { Checkbox, Stack } from '@mui/material'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { ModalFilterType } from '../HBChangeRecordHistory'
import changeRecordHistoryMessages from '../HBChangeRecordHistory.messages'
import { ColumnType } from '../useHBChangeRecordHistory'

export type ModalSearchProps = {
  columns: ColumnType[]
  formProvider: UseFormReturn<ModalFilterType, any>
  handleSearch: (data: ModalFilterType) => void
}

export default function ModalSearch({ columns, formProvider, handleSearch }: ModalSearchProps) {
  const { formatMessage } = useIntl()

  return (
    <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center">
      <HBAutocompleteController
        groupBy={(option) => option?.groupName!}
        label={formatMessage(changeRecordHistoryMessages.filterColumn)}
        fieldName="filterColumn"
        isOptionEqualToValue={(o, v) => o.id == v.id}
        getOptionLabel={(option) => `${option.propertyLocalName || option.propertyName}`}
        options={columns || []}
        autoCompleteProps={{
          fullWidth: true,
          multiple: true,
          limitTags: 5,
          onChange: (event, value) => {
            formProvider.setValue('filterColumn', value)
            formProvider.handleSubmit(handleSearch)()
          },
          renderOption: (props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={<HBIcon type="squareFull" />}
                checkedIcon={<HBIcon type="checkSquare" />}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.propertyLocalName || option.propertyName}
            </li>
          ),
        }}
      />
      <HBTextFieldController
        label={formatMessage(changeRecordHistoryMessages.search)}
        name="search"
        formRules={{ required: false }}
        sx={{ width: 300 }}
        InputProps={{
          endAdornment: <HBIcon type="search" size="small" />,
        }}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            formProvider.handleSubmit(handleSearch)()
          }
        }}
      />
    </Stack>
  )
}
