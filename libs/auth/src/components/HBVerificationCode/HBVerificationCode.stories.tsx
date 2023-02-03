import { Meta, Story } from '@storybook/react'
import HBVerificationCode, { HBVerificationCodeProps } from './HBVerificationCode'
import HBVerificationCodeDoc from './HBVerificationCode.doc'

type HBVerificationCodeStoryType = HBVerificationCodeProps

export default {
  component: HBVerificationCode,
  parameters: {
    docs: {
      page: HBVerificationCodeDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'auth/HBVerificationCode',
} as Meta<HBVerificationCodeStoryType>

const Template: Story<HBVerificationCodeStoryType> = ({
  inputLabel,
  verificationCodeTime,
  countDownResendCaption,
  timerTitle,
}) => (
  <HBVerificationCode
    {...{ inputLabel, verificationCodeTime, countDownResendCaption, timerTitle }}
  />
)

export const Primary: Story<HBVerificationCodeStoryType> = Template.bind({})
Primary.args = {}
