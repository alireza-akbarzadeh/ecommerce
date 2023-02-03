import { ArgTypes, Meta, Story } from '@storybook/react'
import HBDialog from './HBDialog'
import HBDialogDoc from './HBDialog.doc'

type HBDialogStoryType = object
const argTypes: ArgTypes<HBDialogStoryType> = {
  open: {
    type: 'boolean',
    name: 'show/hide',
  },
  content: {
    type: 'string',
    name: 'body content',
  },
  acceptBtn: {
    type: 'string',
    name: 'acceptBtn content',
  },
  rejectBtn: {
    type: 'string',
    name: 'rejectBtn content',
  },
  title: {
    type: 'string',
    name: 'title',
  },
}

export default {
  component: HBDialog,
  parameters: {
    docs: {
      page: HBDialogDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBDialog',
  argTypes,
} as Meta<HBDialogStoryType>

const Template: Story<HBDialogStoryType> = (args) => <HBDialog {...args} />

export const Primary: Story<HBDialogStoryType> = Template.bind({})
Primary.args = {}
