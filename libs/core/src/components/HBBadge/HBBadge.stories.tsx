import { Meta, Story } from '@storybook/react'
import React from 'react'
import { HBIcon } from '../HBIcon'
import HBBadge, { HBBadgeProps } from './HBBadge'
import HBBadgeDoc from './HBBadge.doc'

export default {
  component: HBBadge,
  parameters: {
    docs: {
      page: HBBadgeDoc,
    },
    options: {
      showPanel: true,
    },
    title: 'core/HBBadge',
    argTypes: {
      iconContent: {
        type: 'string',
        name: 'inner Icon ',
      },
    },
  },
} as Meta<HBBadgeProps>

const Template: Story<HBBadgeProps> = (args) => <HBBadge {...args} />

export const Primary = Template.bind({})
export const children = Template.bind({})

Primary.args = {}
children.args = {
  children: <HBIcon size="medium" type="minus" />,
  text: 'child Icon',
}
