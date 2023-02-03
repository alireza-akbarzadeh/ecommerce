import { Button } from '@mui/material'
import { Meta, Story } from '@storybook/react'
import { HBIconType } from '../HBIcon'
import HBTreeViewFlat, { HBTreeViewFlatProps } from './HBTreeViewFlat'
import HBTreeViewFlatDoc from './HBTreeViewFlat.doc'
import CustomContent from './HBTreeViewFlatItem'

type dataStructure = {
  id: string
  pid: string | null
  name: string
  icon: HBIconType
  type?: string
}
const initialNodes: dataStructure[] = [
  {
    id: '1',
    pid: null,
    name: 'کشور (ایران)',
    icon: 'camera',
  },
  {
    id: '6',
    pid: '1',
    name: 'استان (نهران)',
    icon: 'camera',
  },
  {
    id: '9',
    pid: '6',
    name: 'شهر (نهران)',
    icon: 'camera',
  },
  {
    id: '7',
    pid: '1',
    name: 'استان (اصفهان)',
    icon: 'camera',
  },
  {
    id: '8',
    pid: '1',
    name: 'استان (مازندران)',
    icon: 'camera',
  },
  {
    id: '2',
    pid: null,
    name: '(آلمان) کشور',
    icon: 'camera',
  },
  {
    id: '3',
    pid: null,
    name: 'کشور (ایتالیا)',
    icon: 'camera',
  },
  {
    id: '4',
    pid: null,
    name: 'کشور (یونان)',
    icon: 'camera',
  },
  {
    id: '5',
    pid: null,
    name: 'کشور (قبرس)',
    icon: 'camera',
  },
]

export default {
  component: HBTreeViewFlat,
  parameters: {
    docs: {
      page: HBTreeViewFlatDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBTreeViewFlatProps',
  argTypes: {},
} as Meta<HBTreeViewFlatProps<dataStructure>>

const Template: Story<HBTreeViewFlatProps<dataStructure>> = (args) => {
  return (
    <HBTreeViewFlat<dataStructure>
      list={initialNodes}
      listToTreeProps={{
        childField: 'id',
        parentField: 'pid',
        rootParentValue: null,
        titleField: 'name',
        valueField: 'id',
      }}
      AddComponents={(props) => {
        return <Button>افزودن</Button>
      }}
      TreeItemCustomComponents={(props) => <CustomContent {...props} />}
      sx={{ width: 400 }}
    />
  )
}

export const Primary = Template.bind({})
Primary.args = {}
