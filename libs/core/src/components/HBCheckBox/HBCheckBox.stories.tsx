import { CheckboxProps } from '@mui/material'
import { Meta, Story } from '@storybook/react'
import HBCheckBox from './HBCheckBox'
import HBCheckBoxDoc from './HBCheckBox.doc'

export default {
  component: HBCheckBox,
  parameters: {
    docs: {
      page: HBCheckBoxDoc,
    },
    options: {
      showPanel: true,
    },
    design: {
      type: 'figma',
      title: 'Figma Button',
      url: 'https://www.figma.com/file/ir6G7StIV549MaLsMX3B1o/DLS---Core?node-id=217%3A1333',
    },
  },
  title: 'core/HBCheckBox',
  argTypes: {
    checked: {
      name: 'this is checked',
      type: 'boolean',
    },
  },
} as Meta<CheckboxProps>

const Template: Story<CheckboxProps> = (args) => <HBCheckBox {...args} />

export const Primary = Template.bind({})
Primary.args = {
  checked: true,
}
