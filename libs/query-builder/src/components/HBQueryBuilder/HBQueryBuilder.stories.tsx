import React, { Meta, Story } from '@storybook/react'
import HBQueryBuilder from './HBQueryBuilder'
import HBQueryBuilderDoc from './HBQueryBuilder.doc'

export default {
  component: HBQueryBuilder,
  parameters: {
    docs: {
      page: HBQueryBuilderDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'query-builder/HBQueryBuilder',
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
} as Meta<any>

const Template: Story<any> = ({ children, summary, detail, ...args }) => <HBQueryBuilder />

export const Primary = Template.bind({})
Primary.args = {}
