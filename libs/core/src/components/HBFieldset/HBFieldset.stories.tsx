import { Meta, Story } from '@storybook/react'
import React from 'react'
import HBFieldset, { HBFieldsetProps } from './HBFieldset'
import HBFieldsetDoc from './HBFieldset.doc'

export default {
  component: HBFieldset,
  parameters: {
    docs: {
      page: HBFieldsetDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBFieldset',
  argTypes: {
    title: {
      name: 'title',
      type: 'string',
    },
  },
} as Meta<HBFieldsetProps>

const Template: Story<HBFieldsetProps> = (args) => <HBFieldset {...args} />

export const Primary = Template.bind({})
Primary.args = {
  title: 'default title ',
}
