import { Meta, Story } from '@storybook/react'
import HBUploader, { HBUploaderProps } from './HBUploader'
import HBUploaderDoc from './HBUploader.doc'

export default {
  component: HBUploader,
  parameters: {
    docs: {
      page: HBUploaderDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBUploader',
} as Meta<HBUploaderProps>

const Template: Story<HBUploaderProps> = (args) => <HBUploader {...args} />

export const Primary = Template.bind({})
Primary.args = {}
