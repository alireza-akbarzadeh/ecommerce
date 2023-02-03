import { Meta, Story } from '@storybook/react'
import React from 'react'
import HBAccordion, { HBAccordionProps } from './HBAccordion'
import HBAccordionDoc from './HBAccordion.doc'

export default {
  component: HBAccordion,
  parameters: {
    docs: {
      page: HBAccordionDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBAccordion',
  argTypes: {
    summary: {
      name: 'summary',
      type: 'string',
      defaultValue: 'Accordion ',
    },
    detail: {
      name: 'detail',
      type: 'string',
      defaultValue:
        ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.',
    },
  },
} as Meta<HBAccordionProps>

const Template: Story<HBAccordionProps> = ({ summary, detail, ...args }) => (
  <HBAccordion detail={detail} summary={summary} {...args} />
)

export const Primary = Template.bind({})
Primary.args = {}
