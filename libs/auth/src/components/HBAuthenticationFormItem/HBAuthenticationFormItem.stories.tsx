import { HBForm } from '@hasty-bazar/core'
import { ArgTypes, Meta, Story } from '@storybook/react'
import HBAuthenticationFormItem, { HBAuthenticationFormItemProps } from './HBAuthenticationFormItem'
import HBAuthenticationFormItemDoc from './HBAuthenticationFormItem.doc'

const { log } = console

type HBAuthenticationFormItemStoryType = HBAuthenticationFormItemProps & {
  showAlert?: string
}
const argTypes: ArgTypes<HBAuthenticationFormItemStoryType> = {
  showAlert: {
    type: 'string',
  },
}

export default {
  component: HBAuthenticationFormItem,
  parameters: {
    docs: {
      page: HBAuthenticationFormItemDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'auth/HBAuthenticationFormItem',
  argTypes,
} as Meta<HBAuthenticationFormItemStoryType>
interface HBFormInputs {
  otp: string
}
const Template: Story<HBAuthenticationFormItemStoryType> = (args) => {
  const { showAlert, ...otherProps } = args
  return (
    <HBForm<HBFormInputs>
      mode="all"
      style={{ width: 400 }}
      onSubmit={(data) => {
        log(data)
      }}
    >
      <HBAuthenticationFormItem {...otherProps}>{showAlert}</HBAuthenticationFormItem>
    </HBForm>
  )
}

export const Primary: Story<HBAuthenticationFormItemStoryType> = Template.bind({})
Primary.args = {}
