import { Stack } from '@mui/material'
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import { HBButton } from '../HBButton'
import HBSelectTree, { HBSelectTreeDataProps, HBSelectTreeProps } from './HBSelectTree'
import HBSelectTreeDoc from './HBSelectTree.doc'

const data: HBSelectTreeDataProps[] = [
  {
    id: '1',
    parentId: '',
    label: 'عنوان شماره 1',
    value: '1',
  },
  {
    id: '1-1',
    parentId: '1',
    label: 'عنوان شماره 1-1',
    value: '1-1',
  },
  {
    id: '1-2',
    parentId: '1',
    label: 'عنوان شماره 1-2',
    value: '1-2',
  },
  {
    id: '1-2-1',
    parentId: '1-2',
    label: 'عنوان شماره 1-2-1',
    value: '1-2-1',
  },
  {
    id: '1-2-2-1',
    parentId: '1-2-1',
    label: 'عنوان شماره 1-2-2-1',
    value: '1-2-2-1',
  },
  {
    id: '1-2-2-2-1',
    parentId: '1-2-2-1',
    label: 'عنوان شماره 1-2-2-2',
    value: '1-2-2-2-1',
  },
  {
    id: '1-2-2-2-2-1',
    parentId: '1-2-2-2-1',
    label: 'عنوان شماره 1-2-2-2-1',
    value: '1-2-2-2-1',
  },
  {
    id: '1-2-2-2-2-2-1',
    parentId: '1-2-2-2-2-1',
    label: 'عنوان شماره 1-2-2-2-2-1',
    value: '1-2-2-2-2-1',
  },
  {
    id: '2',
    parentId: '',
    label: 'عنوان شماره 2',
    value: '2',
  },
  {
    id: '2-1',
    parentId: '2',
    label: 'عنوان شماره 2-1',
    value: '2-1',
  },
  {
    id: '2-2',
    parentId: '2',
    label: 'عنوان شماره 2-2',
    value: '2-2',
  },
  {
    id: '2-2-1',
    parentId: '2-2',
    label: 'تست عنوان',
    value: '2-2-1',
  },
]

export default {
  component: HBSelectTree,
  parameters: {
    docs: {
      page: HBSelectTreeDoc,
    },
    options: {
      showPanel: true,
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/AE0pgtDvCaP4OGltJ13Z9W/Admin-Dashboard?node-id=901%3A60589',
    },
  },
  title: 'core/HBSelectTree',
  argTypes: {},
} as Meta<HBSelectTreeProps>

const Template: Story<HBSelectTreeProps> = (args) => {
  const [defaultValue, setDefaultValue] = useState<string | string[] | null>(null)
  return (
    <Stack spacing={4}>
      <HBSelectTree
        {...args}
        data={data}
        sx={{ width: 300 }}
        value={defaultValue}
        onChange={setDefaultValue}
      />
      <HBButton onClick={() => setDefaultValue(null)}>Set Value</HBButton>
    </Stack>
  )
}

export const Primary = Template.bind({})
Primary.args = {
  type: 'success',
  open: true,
  message: 'default message ',
}
