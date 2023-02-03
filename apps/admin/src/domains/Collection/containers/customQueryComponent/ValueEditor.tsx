import AdapterDateFns from '@date-io/date-fns-jalali'
import { HBTagsContainer } from '@hasty-bazar/admin-shared/containers/HBTagsContainer'
import { HBCheckBox, HBSelect, HBSwitch, HBTextField, HBTextFieldProps } from '@hasty-bazar/core'
import type { ValueEditorProps } from '@hasty-bazar/query-builder'
import { Box, ListItemText, SelectChangeEvent } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { format } from 'date-fns'
import { FC } from 'react'
import DynamicList from './DynamicList'
import SystemParameter from './SystemParameter'

const ValueEditor: FC<ValueEditorProps> = (props) => {
  if (props.operator === 'null' || props.operator === 'notNull') {
    return null
  }

  const onChangeData = (event: SelectChangeEvent<unknown>) => {
    props.handleOnChange(event.target.value)
  }

  //@ts-ignore
  switch (props.fieldData.type) {
    case 'Integer':
    case 'Money':
    case 'Decimal':
      return (
        <SystemParameter
          {...props}
          renderInput={() => (
            <HBTextField
              onChange={(e) => props.handleOnChange(Number(e.target.value))}
              value={props.value}
              type="number"
              size="small"
            />
          )}
        />
      )

    case 'Text':
      return (
        <SystemParameter
          {...props}
          renderInput={() => (
            <HBTextField
              onChange={(e) => props.handleOnChange(e.target.value.toString())}
              value={props.value}
              size="small"
              type={'text'}
            />
          )}
        />
      )

    case 'Date':
      return (
        <SystemParameter
          {...props}
          renderInput={() => (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={props.value as Date}
                onChange={(value: any) => props.handleOnChange(format(value as Date, 'yyyy-MM-d'))}
                renderInput={(params: HBTextFieldProps) => <HBTextField {...params} size="small" />}
              />
            </LocalizationProvider>
          )}
        />
      )

    case 'Select':
    case 'Color':
    case 'FixedList':
    case 'Programmable':
      return (
        <SystemParameter
          {...props}
          renderInput={() => (
            <HBSelect
              onChange={onChangeData}
              value={(props.value as string[]) || []}
              label=""
              menuItem={props.values!.map((value) => {
                return {
                  title: (
                    <Box display="flex" alignItems="center" gap={4}>
                      <HBCheckBox
                        checked={props?.value?.indexOf(value?.id?.toString() ?? '') > -1}
                      />
                      <ListItemText primary={value?.value} />
                    </Box>
                  ),
                  value: value.id,
                }
              })}
              multiple
              size="small"
              sx={{
                minWidth: 300,
                marginRight: 1,
              }}
              renderValue={(selected) => {
                return props?.values
                  ?.filter((item) => {
                    return (selected as string[])?.indexOf(String(item?.id)) >= 0
                  })
                  .map((item) => item?.value)
                  .join(' , ')
              }}
            />
          )}
        />
      )

    case 'DynamicList':
      return <SystemParameter {...props} renderInput={() => <DynamicList {...props} />} />

    case 'Tokenized':
      return (
        <Box sx={{ display: 'inline-block', maxWidth: 700 }}>
          <HBTagsContainer
            label=""
            tags={props.value || []}
            tagsArray={(value) => {
              props.handleOnChange(value)
            }}
            textFiledProps={{ sx: { verticalAlign: 'unset' } }}
          />
        </Box>
      )

    case 'Logical':
      return (
        <Box sx={{ display: 'inline-block', minWidth: 100, pl: 6 }}>
          <HBSwitch
            checked={props.value}
            onChange={(value) => {
              props.handleOnChange(value.target.checked)
            }}
          />
        </Box>
      )

    default:
      return (
        <HBTextField
          onChange={(e) => props.handleOnChange(e.target.value)}
          value={props.value}
          size="small"
        />
      )
  }
}

ValueEditor.displayName = 'ValueEditor'

export default ValueEditor
