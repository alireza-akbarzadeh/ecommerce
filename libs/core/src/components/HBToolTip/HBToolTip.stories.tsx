import { ArgTypes, Meta, Story } from '@storybook/react'
import HBToolTip from './HBToolTip'
import HBToolTipDoc from './HBToolTip.doc'

type HBToolTipStoryType = object
const argTypes: ArgTypes<HBToolTipStoryType> = {
  title: {
    name: 'title',
    type: 'string',
  },
}

export default {
  component: HBToolTip,
  parameters: {
    docs: {
      page: HBToolTipDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBToolTip',

  argTypes,
} as Meta<HBToolTipStoryType>

const Template: Story<HBToolTipStoryType> = (args) => (
  <HBToolTip children={<span> test </span>} {...args} />
)

export const Primary: Story<HBToolTipStoryType> = Template.bind({})
Primary.args = {}
