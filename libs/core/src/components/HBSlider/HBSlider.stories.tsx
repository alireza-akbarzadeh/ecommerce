import { Meta, Story } from '@storybook/react'
import HBSlider, { HBSliderProps } from './HBSlider'
import HBSliderDoc from './HBSlider.doc'

export default {
  component: HBSlider,
  parameters: {
    docs: {
      page: HBSliderDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBSlider',
  argTypes: {
    size: {
      options: ['small', 'large'],
      control: { type: 'radio' },
    },
    valueLabelDisplay: {
      options: ['auto', 'off', 'on'],
      control: { type: 'radio' },
    },
    color: {
      options: ['primary', 'secondary'],
      control: { type: 'radio' },
    },
    disabled: {
      name: 'disabled',
      type: 'boolean',
    },
    disableSwap: {
      name: 'disableSwap',
      type: 'boolean',
    },
    max: {
      name: 'max',
      type: 'boolean',
    },
    min: {
      name: 'min',
      type: 'boolean',
    },
  },
} as Meta<HBSliderProps>

const Template: Story<HBSliderProps> = (args) => <HBSlider {...args} />

export const Primary = Template.bind({})
Primary.args = {}
