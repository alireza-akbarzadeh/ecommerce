import { HBForm } from '@hasty-bazar/core'
import { ArgTypes, Meta, Story } from '@storybook/react'
import HBPasswordFormItem from './HBPasswordFormItem'
import HBPasswordFormItemDoc from './HBPasswordFormItem.doc'

const { log } = console

type HBPasswordFormItemStoryType = object
const argTypes: ArgTypes<HBPasswordFormItemStoryType> = {}

export default {
  component: HBPasswordFormItem,
  parameters: {
    docs: {
      page: HBPasswordFormItemDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'auth/HBPasswordFormItem',
  argTypes,
} as Meta<HBPasswordFormItemStoryType>

interface HBFormInputs {
  userName: string
  password: string
}

const Template: Story<HBPasswordFormItemStoryType> = (args) => {
  return (
    <HBForm<HBFormInputs>
      onSubmit={(data) => {
        log(data)
      }}
    >
      <HBPasswordFormItem
        {...args}
        firstLinkOnclick={() => {
          log('firstLinkOnclick')
        }}
        secondLinkOnclick={() => {
          log('secondLinkOnclick')
        }}
      />
    </HBForm>
  )
}

export const Primary: Story<HBPasswordFormItemStoryType> = Template.bind({})
Primary.args = {}
