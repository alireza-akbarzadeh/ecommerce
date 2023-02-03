import { Meta, Story } from '@storybook/react'
import HBRating, { HBRatingProps } from './HBRating'
import HBRatingDoc from './HBRating.doc'

export default {
  component: HBRating,
  parameters: {
    docs: {
      page: HBRatingDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBRating',
  argTypes: {
    readOnly: {
      name: 'readonly',
      type: 'boolean',
    },
    disabled: {
      name: 'disabled ',
      type: 'boolean',
    },
    highlightSelectedOnly: {
      name: 'highlight Selected Only ',
      type: 'boolean',
    },
    defaultValue: {
      name: 'default Value ',
      type: 'number',
      defaultValue: 2,
    },
    precision: {
      name: 'precision',
      type: 'number',
      defaultValue: 0.5,
    },
    max: {
      name: 'maximum',
      type: 'number',
    },
    size: {
      name: 'size',
      control: { type: 'select', options: ['small', 'medium', 'large'] },
    },
  },
} as Meta<HBRatingProps>

const Template: Story<HBRatingProps> = (args) => <HBRating {...args} />

export const Primary = Template.bind({})
Primary.args = {}
