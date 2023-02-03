import { ArgTypes, Meta, Story } from '@storybook/react'
import HBIcon, { HBIconProps } from './HBIcon'
import { Icons, IconTypes } from './HBIcon.data'
import HBIconDoc from './HBIcon.doc'

const options = Object.keys(Icons) as typeof IconTypes[number][]

const argTypes: ArgTypes<HBIconProps> = {
  type: {
    name: 'icon type',
    control: { type: 'select', options },
  },
  size: {
    name: 'icon size',
    control: { type: 'select', options: ['small', 'medium', 'large'] },
  },
}

export default {
  component: HBIcon,
  argTypes,
  parameters: {
    docs: {
      page: HBIconDoc,
    },
    options: {
      showPanel: true,
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/ir6G7StIV549MaLsMX3B1o/DLS---Core?node-id=79%3A4874',
    },
  },
  title: 'core/HBIcon',
} as Meta<HBIconProps>

const Template: Story<HBIconProps> = ({ size, type }) => <HBIcon {...{ size, type }} />

export const Primary: Story<HBIconProps> = Template.bind({})

Primary.args = {
  size: 'small',
  type: 'Plus0',
}
