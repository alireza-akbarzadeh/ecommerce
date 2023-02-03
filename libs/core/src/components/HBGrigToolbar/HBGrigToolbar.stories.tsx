import { ArgTypes, Meta, Story } from '@storybook/react'
import HBGrigToolbar from './HBGrigToolbar'
import HBGrigToolbarDoc from './HBGrigToolbar.doc'

type HBGridHeaderStoryType = object
const argTypes: ArgTypes<HBGridHeaderStoryType> = {}

export default {
  component: HBGrigToolbar,
  parameters: {
    docs: {
      page: HBGrigToolbarDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBGrigToolbar',
  argTypes,
} as Meta<HBGridHeaderStoryType>

const Template: Story<HBGridHeaderStoryType> = (args) => <HBGrigToolbar {...args} />

export const Primary: Story<HBGridHeaderStoryType> = Template.bind({})
Primary.args = {}
