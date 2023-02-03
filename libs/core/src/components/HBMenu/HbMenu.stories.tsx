import { Meta, Story } from '@storybook/react'
import { PropsWithChildren } from 'react'
import HbMenu, { HBMenuProps } from './HbMenu'
import HBMenuDoc from './HbMenu.doc'

export default {
  component: HbMenu,
  parameters: {
    docs: {
      page: HBMenuDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HbMenu',
  argTypes: {
    speed: {
      name: 'speed',
      type: 'number',
    },
    countCircle: {
      name: 'countCircle',
      type: 'number',
    },
  },
} as Meta<PropsWithChildren<HBMenuProps>>

const Template: Story<PropsWithChildren<HBMenuProps>> = (args) => <HbMenu {...args} />

export const Primary = Template.bind({})
Primary.args = {}
