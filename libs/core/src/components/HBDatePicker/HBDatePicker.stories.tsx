import AdapterDateFns from '@date-io/date-fns-jalali'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Meta, Story } from '@storybook/react'
import { useState } from 'react'
import { HBTextField, HBTextFieldProps } from '../HBTextField'
import HBDatePicker, { HBDatePickerProps } from './HBDatePicker'
import HBDatePickerDoc from './HBDatePicker.doc'

type HBDatePickerTypes = HBDatePickerProps & HBTextFieldProps
export default {
  component: HBDatePicker,
  parameters: {
    docs: {
      page: HBDatePickerDoc,
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
} as Meta<HBDatePickerTypes>
const Template: Story<HBDatePickerTypes> = (args) => {
  const { size = 'small', helperText = '', ...datePickersProps } = args
  const [value, setValue] = useState<Date | null>(null)
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <HBDatePicker<Date>
        {...datePickersProps}
        value={value}
        onChange={(value) => setValue(value)}
        renderInput={(props: HBTextFieldProps) => (
          <HBTextField {...props} size={size} helperText={helperText} />
        )}
      />
    </LocalizationProvider>
  )
}

export const Primary: Story<HBDatePickerTypes> = Template.bind({})
Primary.args = {
  clearable: true,
  clearText: 'پاک کردن',
  size: 'small',
  inputFormat: 'yyyy-MM-dd',
  views: ['day', 'month', 'year'],
}
