import { ArgTypes, Meta, Story } from '@storybook/react'
import HBTextField, { HBTextFieldProps } from './HBTextField'
import HBTextFieldDoc from './HBTextField.doc'

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
  type: {
    name: 'Type',
    control: { type: 'select', options: ['text', 'password', 'number', 'email', 'tel'] },
  },
  variant: {
    name: 'variant',
    control: { type: 'select', options: ['filled', 'outlined', 'standard'] },
  },
  multiline: {
    type: 'boolean',
    name: 'Multiline',
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
  component: HBTextField,
  argTypes,
  parameters: {
    docs: {
      page: HBTextFieldDoc,
    },
    options: {
      showPanel: true,
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/ir6G7StIV549MaLsMX3B1o/DLS---Core?node-id=82%3A1266',
    },
  },
  title: 'core/HBTextField',
} as Meta<HBTextFieldProps>

const Template: Story<HBTextFieldProps> = (args) => {
  return <HBTextField {...args} />
}

export const Primary = Template.bind({})
Primary.args = {}
