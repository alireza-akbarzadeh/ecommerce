import AdapterDateFns from '@date-io/date-fns-jalali'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Meta, Story } from '@storybook/react'
import { useState } from 'react'
import HBCalendarPicker, { HBCalendarPickerProps } from './HBCalendarPicker'
import HBCalendarPickerDoc from './HBCalendarPicker.doc'

export default {
  component: HBCalendarPicker,
  parameters: {
    docs: {
      page: HBCalendarPickerDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBCalendarPicker',
} as Meta<HBCalendarPickerProps>
const Template: Story<HBCalendarPickerProps> = (args) => {
  const [value, setValue] = useState<Date | null>(null)
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <HBCalendarPicker date={value} onChange={(date) => setValue(date)} />
    </LocalizationProvider>
  )
}

export const Primary: Story<HBCalendarPickerProps> = Template.bind({})
Primary.args = {}
