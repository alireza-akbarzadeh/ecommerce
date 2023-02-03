import { Meta, Story } from '@storybook/react'
import { HBIcon } from '../HBIcon'
import HBChip, { HBChipProps } from './HBChip'
import HBChipDoc from './HBChip.doc'

export default {
  component: HBChip,
  parameters: {
    docs: {
      page: HBChipDoc,
    },
    options: {
      showPanel: true,
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/ir6G7StIV549MaLsMX3B1o/DLS---Core?node-id=272%3A1459',
    },
  },
  title: 'core/HBChip',
  argTypes: {
    text: {
      name: 'text',
      type: 'string',
    },
  },
} as Meta<HBChipProps>

const Template: Story<HBChipProps> = ({ text = 'test', ...args }) => (
  <HBChip text={text} {...args} />
)

export const Primary = Template.bind({})
export const LeftIcon = Template.bind({})
export const RightIcon = Template.bind({})
export const BothIcon = Template.bind({})
Primary.args = {}
LeftIcon.args = {
  leftIcon: <HBIcon size="medium" type="minus" />,
  text: 'Left Icon',
}
RightIcon.args = {
  rightIcon: <HBIcon size="medium" type="plus" />,
  text: 'Right Icon',
}
BothIcon.args = {
  rightIcon: <HBIcon size="medium" type="plus" />,
  leftIcon: <HBIcon size="medium" type="minus" />,
  text: 'Both Icon',
}
