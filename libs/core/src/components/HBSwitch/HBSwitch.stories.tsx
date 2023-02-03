import { Meta, Story } from '@storybook/react'
import HBSwitch, { HBSwitchProps } from './HBSwitch'
import HBSwitchDoc from './HBSwitch.doc'

export default {
  component: HBSwitch,
  parameters: {
    docs: {
      page: HBSwitchDoc,
    },
    options: {
      showPanel: true,
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/ir6G7StIV549MaLsMX3B1o/DLS---Core?node-id=112%3A1512',
    },
  },
  title: 'core/HBSwitch',
  argTypes: {
    disabled: {
      name: 'disabled',
      type: 'boolean',
    },
  },
} as Meta<HBSwitchProps>

const Template: Story<HBSwitchProps> = (args) => <HBSwitch {...args} />

export const Primary = Template.bind({})
Primary.args = {}
