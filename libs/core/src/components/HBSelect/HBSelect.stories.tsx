import { Box, Typography } from '@mui/material'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import HBSelect, { HBSelectProps } from './HBSelect'
import HBSelectDoc from './HBSelect.doc'

export default {
  component: HBSelect,
  parameters: {
    docs: {
      page: HBSelectDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBSelect',
  argTypes: {
    label: {
      name: 'Label',
      type: 'string',
      defaultValue: 'عنوان',
    },
    noneOption: {
      name: 'none Option',
      type: 'string',
      defaultValue: 'خالی',
    },
  },
} as Meta<HBSelectProps>

const Template: Story<HBSelectProps> = ({ label, menuItem, noneOption, renderValue, ...args }) => (
  <HBSelect
    noneOption={noneOption}
    label={label}
    menuItem={menuItem}
    renderValue={renderValue}
    {...args}
  />
)

const Items = [
  { title1: 'Ten', title2: '10', value: 10 },
  { title1: 'Twenty', title2: '20', value: 20 },
  { title1: 'Thirty', title2: '30', value: 30 },
]

export const Primary = Template.bind({})
export const MenuItemReactNode = Template.bind({})

Primary.args = {
  menuItem: [
    { title: 'Ten', value: 10 },
    { title: 'Twenty', value: 20 },
    { title: 'Thirty', value: 30 },
  ],
}

MenuItemReactNode.args = {
  menuItem: Items.map((item) => {
    return {
      title: (
        <Box display="flex" gap={4}>
          <Typography>{item.title1}</Typography>
          <Typography>{item.title2}</Typography>
        </Box>
      ),
      value: item.value,
    }
  }),
  renderValue: (value) => <Box>{Items.filter((item) => item.value == value)[0].title1}</Box>,
}
