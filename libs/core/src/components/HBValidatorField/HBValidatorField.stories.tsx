import { ArgTypes, Meta, Story } from '@storybook/react'
import HBValidatorField, { HBValidatorFieldProps } from './HBValidatorField'
import HBValidatorFieldDoc from './HBValidatorField.doc'

type HBValidatorFieldStoryType = HBValidatorFieldProps
const argTypes: ArgTypes<HBValidatorFieldStoryType> = {
  value: {
    type: 'string',
  },
  rules: {},
}

export default {
  component: HBValidatorField,
  parameters: {
    docs: {
      page: HBValidatorFieldDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBValidatorField',
  argTypes,
} as Meta<HBValidatorFieldStoryType>

const Template: Story<HBValidatorFieldStoryType> = (args) => {
  return <HBValidatorField {...args} />
}

export const Primary: Story<HBValidatorFieldStoryType> = Template.bind({})
Primary.args = {
  value: 'testForTest',
  rules: [
    { text: 'test', isActive: true },
    { text: 'test regex', validator: RegExp('.*\\d.*') },
    // eslint-disable-next-line no-control-regex
    { text: 'test otherLanguage', validator: RegExp('^[\\x00-\\x7f]*$') },
  ],
}
