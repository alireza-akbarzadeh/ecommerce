import { Meta, Story } from '@storybook/react'
import React from 'react'
import HBSelectMultiColumn, { HBSelectMultiColumnProps } from './HBSelectMultiColumn'
import HBSelectMultiColumnDoc from './HBSelectMultiColumn.doc'

export default {
  component: HBSelectMultiColumn,
  parameters: {
    docs: {
      page: HBSelectMultiColumnDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBSelectMultiColumn',
  argTypes: {
    label: {
      name: 'label',
      type: 'string',
    },
  },
} as Meta<HBSelectMultiColumnProps<any, true, false, true>>

const items = [
  { id: 1, label: 'The Shawshank Redemption', year: 1994 },
  { id: 2, label: 'The Godfather', year: 1972 },
  { id: 3, label: 'The Godfather: Part II', year: 1974 },
  { id: 4, label: 'The Dark Knight', year: 2008 },
  { id: 5, label: '12 Angry Men', year: 1957 },
  { id: 6, label: "Schindler's List", year: 1993 },
  { id: 7, label: 'Pulp Fiction', year: 1994 },
]

const Template: Story<HBSelectMultiColumnProps<any, true, false, true>> = (args) => {
  const { renderInputProps, columnDefs, ...otherArgs } = args
  return (
    <HBSelectMultiColumn
      columnDefs={[
        { field: 'id', headerName: '', width: 0, hidden: true, isIdField: true },
        { field: 'label', headerName: 'عنوان', width: 200, showInChip: true },
        { field: 'year', headerName: 'سال', width: 200 },
      ]}
      items={items}
      {...otherArgs}
    />
  )
}

export const Primary = Template.bind({})
Primary.args = {}
