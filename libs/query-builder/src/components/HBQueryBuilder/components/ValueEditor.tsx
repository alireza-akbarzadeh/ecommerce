import AdapterDateFns from '@date-io/date-fns-jalali'
import { HBCheckBox, HBSelect, HBTextField, HBTextFieldProps } from '@hasty-bazar/core'
import { Box, ListItemText, SelectChangeEvent } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { format } from 'date-fns'
import { FC } from 'react'
import type { ValueEditorProps } from 'react-querybuilder'

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
        <HBTextField
          onChange={(e) => props.handleOnChange(Number(e.target.value))}
          value={props.value}
          type="number"
          size="small"
        />
      )

    case 'Text':
      return (
        <HBTextField
          onChange={(e) => props.handleOnChange(e.target.value)}
          value={props.value}
          size="small"
        />
      )

    case 'Date':
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={props.value as Date}
            onChange={(value: any) => props.handleOnChange(format(value as Date, 'yyyy-MM-d'))}
            renderInput={(params: HBTextFieldProps) => <HBTextField {...params} size="small" />}
          />
        </LocalizationProvider>
      )

    case 'Select':
    case 'Color':
    case 'FixedList':
      return (
        <HBSelect
          onChange={onChangeData}
          value={(props.value as string[]) || []}
          label=""
          menuItem={props.values!.map((value) => {
            return {
              title: (
                <Box display="flex" alignItems="center" gap={4}>
                  <HBCheckBox checked={props?.value?.indexOf(value?.id?.toString() ?? '') > -1} />
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
