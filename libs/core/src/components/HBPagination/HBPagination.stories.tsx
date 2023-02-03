import { ArgTypes, Meta, Story } from '@storybook/react'
import HBPagination from './HBPagination'
import HBPaginationDoc from './HBPagination.doc'

type HBGridPaginationStoryType = object
const argTypes: ArgTypes<HBGridPaginationStoryType> = {
  count: {
    name: 'count',
    type: 'number',
  },
}

export default {
  component: HBPagination,
  parameters: {
    docs: {
      page: HBPaginationDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBGridPagination',
  argTypes,
} as Meta<HBGridPaginationStoryType>

const Template: Story<HBGridPaginationStoryType> = (args) => <HBPagination {...args} />

export const Primary: Story<HBGridPaginationStoryType> = Template.bind({})
Primary.args = {}
