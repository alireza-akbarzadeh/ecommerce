import { Meta, Story } from '@storybook/react'
import HBInputBase, { HBInputBaseProps } from './HBInputBase'
import HBInputBaseDoc from './HBInputBase.doc'

export default {
  component: HBInputBase,
  parameters: {
    docs: {
      page: HBInputBaseDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBMaskInputBase',
} as Meta<HBInputBaseProps>

const Template: Story<HBInputBaseProps> = ({ mask, ...args }) => (
  <HBInputBase mask={mask} {...args} />
)

export const Primary = Template.bind({})
Primary.args = {}
