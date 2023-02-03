import { Meta, Story } from '@storybook/react'
import HBSkeleton, { HBSkeletonProps } from './HBSkeleton'
import HBSkeletonDoc from './HBSkeleton.doc'

export default {
  component: HBSkeleton,
  parameters: {
    docs: {
      page: HBSkeletonDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBSkeleton',
  argTypes: {
    variant: {
      name: 'variant',
      control: {
        type: 'select',
        options: ['circular', 'rectangular', 'text', 'string'],
      },
    },
  },
} as Meta<HBSkeletonProps>

const Template: Story<HBSkeletonProps> = (args) => <HBSkeleton {...args} />

export const Primary = Template.bind({})
export const Circular = Template.bind({})
export const Rectangular = Template.bind({})
export const Animation = Template.bind({})

Primary.args = {}
Circular.args = {
  width: 40,
  height: 40,
  variant: 'circular',
}

Rectangular.args = {
  width: 210,
  height: 118,
  variant: 'rectangular',
}

Animation.args = {
  width: 210,
  height: 118,
  variant: 'rectangular',
  animation: true,
}
