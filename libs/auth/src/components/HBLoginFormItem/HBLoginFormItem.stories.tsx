import { HBForm } from '@hasty-bazar/core'
import { ArgTypes, Meta, Story } from '@storybook/react'
import HBLoginFormItem from './HBLoginFormItem'
import HBLoginFormItemDoc from './HBLoginFormItem.doc'

const { log } = console

type HBLoginFormItemStoryType = object
const argTypes: ArgTypes<HBLoginFormItemStoryType> = {}

export default {
  component: HBLoginFormItem,
  parameters: {
    docs: {
      page: HBLoginFormItemDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'auth/HBLoginFormItem',
  argTypes,
} as Meta<HBLoginFormItemStoryType>

interface HBFormInputs {
  userName: string
  password: string
}

const Template: Story<HBLoginFormItemStoryType> = (args) => {
  return (
    <HBForm<HBFormInputs>
      onSubmit={(data) => {
        log(data)
      }}
    >
      <HBLoginFormItem {...args} />
    </HBForm>
  )
}

export const Primary: Story<HBLoginFormItemStoryType> = Template.bind({})
Primary.args = {}
