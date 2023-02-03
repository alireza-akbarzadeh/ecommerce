import AdapterDateFns from '@date-io/date-fns-jalali'
import { DateTimePickerProps } from '@mui/lab'
import { TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import { HBTextFieldProps } from '../HBTextField'
import HBDateTimePicker, { HBDateTimePickerProps } from './HBDateTimePicker'
import HBDateTimePickerDoc from './HBDateTimePicker.doc'

type HBDateTimePickerTypes = DateTimePickerProps & Partial<HBTextFieldProps>
export default {
  component: HBDateTimePicker,
  parameters: {
    docs: {
      page: HBDateTimePickerDoc,
    },
    options: {
      showPanel: true,
    },
  },
  argTypes: {
    label: {
      type: 'string',
    },
    size: {
      options: ['small', 'medium'],
      control: { type: 'radio' },
    },
    helperText: {
      type: 'string',
    },
    openTo: {
      options: ['day', 'month', 'year'],
      control: 'radio',
    },
    clearable: {
      type: 'boolean',
    },
    showToolbar: {
      type: 'boolean',
    },
    loading: {
      type: 'boolean',
    },
    clearText: {
      type: 'string',
    },
    cancelText: {
      type: 'string',
    },
    inputFormat: {
      type: 'string',
    },
  },
  title: 'core/HBDatePicker',
} as Meta<HBDateTimePickerTypes>
const Template: Story<HBDateTimePickerTypes> = (args) => {
  const { size = 'small', helperText = '', ...datePickersProps } = args
  const [value, setValue] = useState<Date | null>(null)
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <HBDateTimePicker<Date>
        {...(datePickersProps as HBDateTimePickerProps)}
        value={value}
        onChange={(value) => setValue(value)}
        renderInput={(props: HBTextFieldProps) => (
          <TextField {...props} size={size} helperText={helperText} />
        )}
      />
    </LocalizationProvider>
  )
}

export const Primary: Story<HBDateTimePickerTypes> = Template.bind({})
Primary.args = {
  clearable: true,
  clearText: 'پاک کردن',
  size: 'small',
  inputFormat: 'yyyy-MM-dd',
  views: ['day', 'month', 'year'],
}
