import { Meta, Story } from '@storybook/react'
import HBLoading, { HBLoadingProps } from './HBLoading'
import HBLoadingDoc from './HBLoading.doc'

export default {
  component: HBLoading,
  parameters: {
    docs: {
      page: HBLoadingDoc,
    },
    options: {
      showPanel: true,
    },
    design: {
      type: 'figma',
      title: 'Figma Button',
      url: 'https://www.figma.com/file/ir6G7StIV549MaLsMX3B1o/DLS---Core?node-id=272%3A1440',
    },
  },
  title: 'core/HBLoading',
  argTypes: {
    speed: {
      name: 'speed',
      type: 'number',
    },
    countCircle: {
      name: 'countCircle',
      type: 'number',
    },
  },
} as Meta<HBLoadingProps>

const Template: Story<HBLoadingProps> = (args) => <HBLoading {...args} />

export const Primary = Template.bind({})
Primary.args = {}
