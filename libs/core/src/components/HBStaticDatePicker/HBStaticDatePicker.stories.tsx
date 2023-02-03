import AdapterDateFns from '@date-io/date-fns-jalali'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Meta, Story } from '@storybook/react'
import { useState } from 'react'
import { HBTextField, HBTextFieldProps } from '../HBTextField'
import HBStaticDatePicker, { HBStaticDatePickerProps } from './HBStaticDatePicker'
import HBStaticDatePickerDoc from './HBStaticDatePicker.doc'

type HBStaticDatePickerType = HBStaticDatePickerProps & HBTextFieldProps

export default {
  component: HBStaticDatePicker,
  parameters: {
    docs: {
      page: HBStaticDatePickerDoc,
    },
    options: {
      showPanel: true,
    },
  },
  argTypes: {
    label: {
      type: 'string',
    },
    openTo: {
      options: ['day', 'month', 'year'],
      control: 'radio',
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
    inputFormat: {
      type: 'string',
    },
    foo: {
      table: {
        disable: true,
      },
    },
    orientation: {
      options: ['landscape', 'portrait'],
      control: 'radio',
    },
  },
  title: 'core/HBStaticDatePicker',
} as Meta<HBStaticDatePickerType>

const Template: Story<HBStaticDatePickerType> = (args) => {
  const [value, setValue] = useState<Date | null>(null)
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <HBStaticDatePicker<Date>
        {...args}
        value={value}
        onChange={(value) => setValue(value)}
        renderInput={(props: HBTextFieldProps) => <HBTextField {...props} />}
      />
    </LocalizationProvider>
  )
}

export const Primary: Story<HBStaticDatePickerType> = Template.bind({})
Primary.args = {
  views: ['day', 'month', 'year'],
}
