import { Meta, Story } from '@storybook/react'
import HBCircularProgressBtn, { HBCircularProgressBtnProps } from './HBCircularProgressBtn'
import HBCircularProgressBtnDoc from './HBCircularProgressBtn.doc'

export default {
  component: HBCircularProgressBtn,
  parameters: {
    docs: {
      page: HBCircularProgressBtnDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBCircularProgressBtn',
  argTypes: {
    isWhite: { type: 'boolean' },
  },
} as Meta<HBCircularProgressBtnProps>

const Template: Story<HBCircularProgressBtnProps> = (args) => <HBCircularProgressBtn {...args} />

export const Primary = Template.bind({})
Primary.args = {}
