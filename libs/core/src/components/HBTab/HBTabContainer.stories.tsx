import { ArgTypes, Meta, Story } from '@storybook/react'
import HBTabContainer, { HBTabContainerProps } from './HBTabContainer'
import HBTabContainerDoc from './HBTabContainer.doc'

type HBTabContainerStoryType = HBTabContainerProps
const argTypes: ArgTypes<HBTabContainerStoryType> = {
  tabItemS: {
    defaultValue: [],
  },
  value: {
    type: 'string',
    defaultValue: '1',
  },
}

export default {
  component: HBTabContainer,
  parameters: {
    docs: {
      page: HBTabContainerDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBTab',
  argTypes,
} as unknown as Meta<HBTabContainerStoryType>

const Template: Story<HBTabContainerStoryType> = (args) => <HBTabContainer {...args} />

export const Primary = Template.bind({})
Primary.args = {
  tabItemS: [
    {
      tabTitles: 'اسلایدر کسب وکاری',
      tabContents: 'ttttt',
    },
    {
      tabTitles: 'تصویر',
      tabContents: 'ttttt',
      tabTitleProps: { disabled: true },
    },
    {
      tabTitles: '',
      tabContents: 'zzzz',
    },
  ],
}
