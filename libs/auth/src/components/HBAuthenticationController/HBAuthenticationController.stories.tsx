import { HBForm } from '@hasty-bazar/core'
import { ArgTypes, Meta, Story } from '@storybook/react'
import HBAuthenticationController, {
  HBAuthenticationControllerProps,
} from './HBAuthenticationController'
import HBAuthenticationControllerDoc from './HBAuthenticationController.doc'

const { log } = console

type HBAuthenticationControllerStoryType = HBAuthenticationControllerProps
const argTypes: ArgTypes<HBAuthenticationControllerStoryType> = {}

export default {
  component: HBAuthenticationController,
  parameters: {
    docs: {
      page: HBAuthenticationControllerDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'auth/HBAuthenticationController',
  argTypes,
} as Meta<HBAuthenticationControllerStoryType>

interface HBFormInputs {
  otp: string
}
const Template: Story<HBAuthenticationControllerStoryType> = (args) => {
  return (
    <HBForm<HBFormInputs>
      style={{ width: 400 }}
      mode="all"
      onSubmit={(data) => {
        log(data)
      }}
    >
      <HBAuthenticationController
        {...args}
        timeoutBtnCallBack={() => alert('timeout linked click')}
      />
    </HBForm>
  )
}

export const Primary: Story<HBAuthenticationControllerStoryType> = Template.bind({})
Primary.args = {}
