import { Meta, Story } from '@storybook/react'
import HBTag, { HBTagProps } from './HBTag'
import HBTagDoc from './HBTag.doc'

export default {
  component: HBTag,
  parameters: {
    docs: {
      page: HBTagDoc,
    },
    options: {
      showPanel: true,
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/hvPW4QWYZp5SUJjyHeSg9Q/Product-Attribute%2C-Product-Category?node-id=940%3A6014',
    },
  },
  title: 'core/HBTag',
  argTypes: {},
} as Meta<HBTagProps>

const Template: Story<HBTagProps> = ({ ...args }) => <HBTag label={args.label} {...args} />

export const Default = Template.bind({})

Default.args = {
  label: 'تگ',
  onDelete: () => ({}),
  dir: 'rtl',
  variant: 'outlined',
}
