import { ArgTypes, Meta, Story } from '@storybook/react'
import HBSubmitButton from './HBSubmitButton'
import HBSubmitButtonDoc from './HBSubmitButton.doc'

type HBSubmitButtonStoryType = object
const argTypes: ArgTypes<HBSubmitButtonStoryType> = {}

export default {
  component: HBSubmitButton,
  parameters: {
    docs: {
      page: HBSubmitButtonDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBSubmitButton',
  argTypes,
} as Meta<HBSubmitButtonStoryType>

const Template: Story<HBSubmitButtonStoryType> = (args) => <HBSubmitButton {...args} />

export const Primary: Story<HBSubmitButtonStoryType> = Template.bind({})
Primary.args = {}
