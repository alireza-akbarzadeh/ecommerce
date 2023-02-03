import { Box } from '@mui/material'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { HBTextField } from '../HBTextField'
import HBSuggest, { HBSuggestProps } from './HBSuggest'
import HBSuggestDoc from './HBSuggest.doc'

export default {
  component: HBSuggest,
  parameters: {
    docs: {
      page: HBSuggestDoc,
    },
    options: {
      showPanel: true,
    },
    design: {},
  },
  title: 'core/HBSuggest',
  argTypes: {
    disabled: {
      name: 'disabled',
      type: 'boolean',
    },
  },
} as Meta<HBSuggestProps>

const suggestItems = [
  { title: 'test1', value: '@test1' },
  { title: 'test2', value: '@test2' },
  { title: 'test3', value: '@test3' },
  { title: 'test4', value: '@test4' },
  { title: 'test5', value: '@test5' },
  { title: 'test6', value: '@test6' },
  { title: 'test7', value: '@test7' },
  { title: 'test8', value: '@test8' },
  { title: 'test9', value: '@test9' },
  { title: 'test10', value: '@test10' },
  { title: 'test11', value: '@test11' },
  { title: 'test12', value: '@test12' },
  { title: 'test13', value: '@test13' },
]

const Template: Story<HBSuggestProps> = (args) => {
  const { items, onChange, value, ...otherArgs } = args
  return (
    <HBSuggest
      items={suggestItems}
      {...otherArgs}
      renderInput={(param) => {
        return (
          <HBTextField
            {...param}
            rows={4}
            onChange={(event) => {
              param.onChange(event.target.value)
            }}
          />
        )
      }}
      renderItem={(param) => {
        return <Box>{param.item.title}</Box>
      }}
      paperComponent={(param) => {
        return (
          <>
            <Box>هدر</Box>
            <Box>{param.children}</Box>
          </>
        )
      }}
    />
  )
}

export const Primary = Template.bind({})
Primary.args = {}
