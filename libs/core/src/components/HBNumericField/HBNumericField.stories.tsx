import { ArgTypes, Meta, Story } from '@storybook/react'
import React from 'react'
import HBNumericField, { HBNumericFieldProps } from './HBNumericField'
import HBNumericFieldDoc from './HBNumericField.doc'

const argTypes: Partial<ArgTypes<any>> = {
  label: {
    type: 'string',
    name: 'Label',
    defaultValue: 'عنوان',
  },
  helperText: {
    type: 'string',
    name: 'Helper Text',
  },
  error: {
    type: 'boolean',
    name: 'Error',
  },
  required: {
    type: 'boolean',
    name: 'Required',
  },
  disabled: {
    type: 'boolean',
    name: 'Disabled',
  },
  placeholder: {
    type: 'string',
    name: 'Placeholder',
  },
  size: {
    name: 'size',
    control: { type: 'select', options: ['small', 'normal'] },
  },
  fullWidth: {
    type: 'boolean',
    name: 'full Width ',
  },
  color: {
    type: 'string',
    name: 'color ',
    control: { type: 'select', options: ['primary', 'secondary', 'warning', 'info'] },
  },
  defaultValue: {
    type: 'string',
    name: 'defaultValue ',
  },
}

export default {
  component: HBNumericField,
  argTypes,
  parameters: {
    docs: {
      page: HBNumericFieldDoc,
    },
    options: {
      showPanel: true,
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/ir6G7StIV549MaLsMX3B1o/DLS---Core?node-id=82%3A1266',
    },
  },
  title: 'core/HBNumericField',
} as Meta<HBNumericFieldProps>

const Template: Story<HBNumericFieldProps> = (args) => {
  return <HBNumericField {...args} />
}

export const Primary = Template.bind({})
Primary.args = {}
