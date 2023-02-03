import { ArgTypes, Meta, Story } from '@storybook/react'
import HBRadioButton from './HBRadioButton'
import HBRadioButtonDoc from './HBRadioButton.doc'

type HBRadioButtonStoryType = object
const argTypes: ArgTypes<HBRadioButtonStoryType> = {
  disabled: {
    name: 'disabled',
    type: 'boolean',
  },
  checked: {
    name: 'checked',
    type: 'boolean',
  },
}

export default {
  component: HBRadioButton,
  parameters: {
    docs: {
      page: HBRadioButtonDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBRadioButton',
  argTypes,
} as Meta<HBRadioButtonStoryType>

const Template: Story<HBRadioButtonStoryType> = (args) => <HBRadioButton {...args} />

export const Primary: Story<HBRadioButtonStoryType> = Template.bind({})
Primary.args = {}
