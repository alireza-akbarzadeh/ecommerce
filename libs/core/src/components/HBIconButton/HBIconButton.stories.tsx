import { ArgTypes, Meta, Story } from '@storybook/react'
import { Icons, IconTypes } from '../HBIcon/HBIcon.data'
import HBIconButton from './HBIconButton'
import HBIconButtonDoc from './HBIconButton.doc'

const options = Object.keys(Icons) as typeof IconTypes[number][]
const placementOptions = ['bottom', 'left', 'right', 'top']

type HBIconButtonStoryType = object
const argTypes: ArgTypes<HBIconButtonStoryType> = {
  icon: {
    name: 'icon',
    control: { type: 'select', options },
  },
  variant: {
    name: 'variant',
    control: { type: 'select', options: ['text', 'outlined'] },
  },
  iconSize: {
    name: 'iconSize',
    control: { type: 'select', options: ['small', 'medium', 'large'] },
  },
  placement: {
    name: 'placement',
    control: { type: 'select', options: placementOptions },
  },
  tooltip: {
    name: 'tooltip',
    type: 'string',
  },
}

export default {
  component: HBIconButton,
  parameters: {
    docs: {
      page: HBIconButtonDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBIconButton',
  argTypes,
} as Meta<HBIconButtonStoryType>

const Template: Story<HBIconButtonStoryType> = (args) => <HBIconButton {...args} />

export const Primary: Story<HBIconButtonStoryType> = Template.bind({})
Primary.args = {
  icon: 'Plus21',
}
