import { Meta, Story } from '@storybook/react'
import HBFormHeader, { HBFormHeaderProps } from './HBFormHeader'
import HBFormHeaderDoc from './HBFormHeader.doc'

type HBFormHeaderStoryType = HBFormHeaderProps
// const argTypes: ArgTypes<HBFormHeaderStoryType> = {
//   title:
// }

export default {
  component: HBFormHeader,
  parameters: {
    docs: {
      page: HBFormHeaderDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'auth/HBFormHeader',
  // argTypes,
} as Meta<HBFormHeaderStoryType>

const Template: Story<HBFormHeaderStoryType> = ({ title, subTitle }) => (
  <HBFormHeader {...{ title, subTitle }} />
)

export const Primary: Story<HBFormHeaderStoryType> = Template.bind({})
Primary.args = {}
