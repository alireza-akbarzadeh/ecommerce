import { Meta, Story } from '@storybook/react'
import HBToast, { HBToastProps } from './HBToast'
import HBToastDoc from './HBToast.doc'

export default {
  component: HBToast,
  parameters: {
    docs: {
      page: HBToastDoc,
    },
    options: {
      showPanel: true,
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/ir6G7StIV549MaLsMX3B1o/DLS---Core?node-id=143%3A1296',
    },
  },
  title: 'core/HBToast',
  argTypes: {
    type: {
      name: 'messageType',
      control: {
        type: 'select',
        options: ['success', 'error', 'warning', 'info'],
      },
    },
    message: {
      name: 'message',
      type: 'string',
    },
  },
} as Meta<HBToastProps>

const Template: Story<HBToastProps> = (args) => <HBToast {...args} />

export const Primary = Template.bind({})
Primary.args = {
  type: 'success',
  open: true,
  message: 'default message ',
}
