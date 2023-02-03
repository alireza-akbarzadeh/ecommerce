import { Meta, Story } from '@storybook/react'
import React from 'react'
import HBChart, { HBChartProps } from './HBChart'
import HBChartDoc from './HBChart.doc'

const options = {
  title: {},
  tooltip: {
    trigger: 'axis',
  },
  dataset: {
    dimensions: ['product', '2015', '2016', '2017'],
    source: [
      { product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
      { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
      { product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5 },
      { product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1 },
    ],
  },
  xAxis: {
    type: 'category',
    axisLabel: {
      formatter: '{value} kg',
      align: 'center',
    },
  },
  yAxis: {},
  series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
}

export default {
  component: HBChart,
  parameters: {
    docs: {
      page: HBChartDoc,
    },
    options: {
      showPanel: true,
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/ir6G7StIV549MaLsMX3B1o/DLS---Core?node-id=272%3A1459',
    },
  },
  title: 'core/HBChart',
  argTypes: {
    chartType: {
      name: 'chart type',
      control: { type: 'select', options: ['line', 'bar', 'pie', 'area'] },
    },
  },
} as Meta<HBChartProps>

const Template: Story<HBChartProps> = ({ ...args }) => (
  <HBChart {...args} option={options} sx={{ height: 500 }} />
)

export const Primary = Template.bind({})
Primary.args = {
  chartType: 'line',
}
