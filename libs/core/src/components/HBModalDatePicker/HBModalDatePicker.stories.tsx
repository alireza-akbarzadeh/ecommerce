import AdapterDateFns from '@date-io/date-fns-jalali'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Meta, Story } from '@storybook/react'
import { useState } from 'react'
import { HBTextField, HBTextFieldProps } from '../HBTextField'
import HBModalDatePicker, { HBModalDatePickerProps } from './HBModalDatePicker'
import HBModalDatePickerDoc from './HBModalDatePicker.doc'

type HBModalDatePickerType = HBModalDatePickerProps & HBTextFieldProps

export default {
  component: HBModalDatePicker,
  parameters: {
    docs: {
      page: HBModalDatePickerDoc,
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
    okText: {
      type: 'string',
    },
    inputFormat: {
      type: 'string',
    },
    foo: {
      table: {
        disable: true,
      },
    },
  },
  title: 'core/HBModalDatePicker',
} as Meta<HBModalDatePickerType>

const Template: Story<HBModalDatePickerType> = (args) => {
  const { size, helperText, ...HBModalDatePickerProps } = args
  const [value, setValue] = useState<Date | null>(null)
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <HBModalDatePicker<Date>
        {...HBModalDatePickerProps}
        value={value}
        onChange={(value) => setValue(value)}
        renderInput={(props: HBTextFieldProps) => (
          <HBTextField {...props} size={size} helperText={helperText} />
        )}
      />
    </LocalizationProvider>
  )
}

export const Primary: Story<HBModalDatePickerType> = Template.bind({})
Primary.args = {
  label: 'تاریخ شروع',
  clearable: true,
  clearText: 'پاکش کن',
  cancelText: 'بی خیال',
  okText: 'این تاریخ خوبه',
  size: 'small',
  inputFormat: 'yyyy-MM-dd',
  views: ['day', 'month', 'year'],
}
