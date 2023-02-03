import { Meta, Story } from '@storybook/react'
import HBStringValidation, { HBStringValidationProps } from './HBStringValidation'
import HBStringValidationDoc from './HBStringValidation.doc'

export default {
  component: HBStringValidation,
  parameters: {
    docs: {
      page: HBStringValidationDoc,
    },
    options: {
      showPanel: true,
    },
    design: {
      type: 'figma',
      title: 'Figma Button',
      url: 'https://www.figma.com/file/eFLrW1AKlq3mUkp5IrGpAe/Login-Forget-Password?node-id=384%3A1784',
    },
  },
  title: 'core/HBStringValidation',
} as Meta

const Template: Story<HBStringValidationProps> = (args) => {
  const { text, ...other } = args
  return <HBStringValidation text={text} {...other} />
}

export const Primary = Template.bind({})
Primary.args = {
  text: 'حداقل یک کاراکتر خاص',
  isActive: false,
}
