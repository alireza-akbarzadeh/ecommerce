import { Meta, Story } from '@storybook/react'
import React from 'react'
import HBAvatar, { HBAvatarProps } from './HBAvatar'
import HBAvatarDoc from './HBAvatar.doc'

export default {
  component: HBAvatar,
  parameters: {
    docs: {
      page: HBAvatarDoc,
    },
    options: {
      showPanel: true,
    },
    title: 'core/HBAvatar',
    argTypes: {
      iconContent: {
        type: 'string',
        name: 'inner Icon ',
      },
    },
  },
} as Meta<HBAvatarProps>

const Template: Story<HBAvatarProps> = (args) => <HBAvatar {...args} />

export const Primary = Template.bind({})

Primary.args = {}
