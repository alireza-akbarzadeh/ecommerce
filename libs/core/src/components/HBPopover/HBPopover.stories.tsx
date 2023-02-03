import { Meta, Story } from '@storybook/react'
import HBPopover, { HBPopoverProps } from './HBPopover'
import HBPopoverDoc from './HBPopover.doc'

export default {
  component: HBPopover,
  parameters: {
    docs: {
      page: HBPopoverDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBPopover',
  argTypes: {
    open: {
      name: 'open',
      type: 'boolean',
    },
  },
} as Meta<HBPopoverProps>

const Template: Story<HBPopoverProps> = (args) => {
  const { open, ...otherArgs } = args
  return <HBPopover {...otherArgs} open={open} />
}

export const Primary = Template.bind({})
Primary.args = {
  children: 'محتوای تستی جهت نمایش',
}
