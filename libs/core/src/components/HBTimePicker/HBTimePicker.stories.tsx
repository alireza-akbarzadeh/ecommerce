import AdapterDateFns from '@date-io/date-fns-jalali'
import { TimePickerProps } from '@mui/lab'
import { TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import { HBTextFieldProps } from '../HBTextField'
import HBTimePicker, { HBTimePickerProps } from './HBTimePicker'
import HBTimePickerDoc from './HBTimePicker.doc'

type HBTimePickerTypes = TimePickerProps & Partial<HBTextFieldProps>
export default {
  component: HBTimePicker,
  parameters: {
    docs: {
      page: HBTimePickerDoc,
    },
    options: {
      showPanel: true,
    },
  },
  argTypes: {
    label: {
      type: 'string',
    },
    readOnly: {
      type: 'boolean',
    },
  },
  title: 'core/HBTimePicker',
} as Meta<HBTimePickerTypes>
const Template: Story<HBTimePickerTypes> = (args) => {
  const { size = 'small', helperText = '', ...timePickersProps } = args
  const [value, setValue] = useState<Date | null>(new Date())
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <HBTimePicker<Date>
        {...(timePickersProps as HBTimePickerProps)}
        value={value}
        onChange={(value) => setValue(value)}
        renderInput={(props: HBTextFieldProps) => (
          <TextField {...props} size={size} helperText={helperText} />
        )}
      />
    </LocalizationProvider>
  )
}

export const Primary: Story<HBTimePickerTypes> = Template.bind({})
Primary.args = {
  clearText: 'پاک کردن',
  readOnly: false,
  label: 'ساعت',
}
