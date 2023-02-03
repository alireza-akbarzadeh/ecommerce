import { ArgTypes, Meta, Story } from '@storybook/react'
import HBGridHeader from './HBGridHeader'
import HBGridHeaderDoc from './HBGridHeader.doc'

type HBGridHeaderStoryType = object
const argTypes: ArgTypes<HBGridHeaderStoryType> = {}

export default {
  component: HBGridHeader,
  parameters: {
    docs: {
      page: HBGridHeaderDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBGridHeader',
  argTypes,
} as Meta<HBGridHeaderStoryType>

const Template: Story<HBGridHeaderStoryType> = (args) => <HBGridHeader {...args} />

export const Primary: Story<HBGridHeaderStoryType> = Template.bind({})
Primary.args = {}
