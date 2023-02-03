import { ArgTypes, Meta, Story } from '@storybook/react'
import HBCountDownTimer, { HBCountDownTimerProps } from './HBCountDownTimer'
import HBCountDownTimerDoc from './HBCountDownTimer.doc'

const argTypes: ArgTypes<HBCountDownTimerProps> = {
  targetDate: {
    type: 'number',
    name: 'remainTime',
    defaultValue: 2,
  },
  linkText: {
    type: 'string',
    defaultValue: 'ارسال مجدد کد',
  },
}

export default {
  component: HBCountDownTimer,
  parameters: {
    docs: {
      page: HBCountDownTimerDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBCountDownTimer',
  argTypes,
} as Meta<HBCountDownTimerProps>

export const Template: Story<HBCountDownTimerProps> = (({
  targetDate,
  linkText,
  onClick,
  mode,
}) => {
  return <HBCountDownTimer {...{ targetDate, linkText, onClick, mode }} />
}).bind({})

Template.args = {}
