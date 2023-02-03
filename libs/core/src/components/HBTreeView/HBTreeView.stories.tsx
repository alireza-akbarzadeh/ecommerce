import { useTreeItem } from '@mui/lab'
import { Box, Stack, Typography } from '@mui/material'
import { Meta, Story } from '@storybook/react'
import clsx from 'clsx'
import { forwardRef, useState } from 'react'
import { HBIcon, HBIconButton } from '..'
import { HBButton } from '../HBButton'
import HBTreeView, { HBTreeViewProps, ItemComponentProps, RenderTree } from './HBTreeView'
import HBTreeViewDoc from './HBTreeView.doc'

export default {
  component: HBTreeView,
  parameters: {
    docs: {
      page: HBTreeViewDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBTreeView',
  argTypes: {
    treeItems: {
      name: 'treeItems',
      type: 'symbol',
    },
  },
} as Meta<HBTreeViewProps>

const initialNodes: RenderTree[] = [
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

const Template: Story<HBTreeViewProps> = (args) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('')

  const handleSelect = (event: React.SyntheticEvent, nodeId: string) => {
    // setSelectedNodeId(nodeId)
  }

  return (
    <HBTreeView
      AddComponent={({ addNode, moveNode, node, isRoot, nodes }) => (
        <div>
          {isRoot && (
            <div>
              <HBButton onClick={() => moveNode(nodes, selectedNodeId, true)}>Up</HBButton>
              <HBButton onClick={() => moveNode(nodes, selectedNodeId, false)}>Down</HBButton>
            </div>
          )}
          <HBButton onClick={() => addNode(node)}>Add</HBButton>
        </div>
      )}
      selected={selectedNodeId}
      onNodeSelect={handleSelect}
      treeItems={initialNodes}
      {...args}
    />
  )
}

const Template2: Story<HBTreeViewProps> = (args) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('')
  const [nodes, setNodes] = useState<RenderTree[]>(initialNodes)

  const handleSelect = (event: React.SyntheticEvent, nodeId: string) => {
    setSelectedNodeId(nodeId)
  }

  const CustomContent = forwardRef(function CustomContent(props: ItemComponentProps, ref) {
    const {
      classes,
      className,
      label,
      nodeId,
      icon: iconProp,
      expansionIcon,
      displayIcon,
      count,
      isAnyChildrenSelected,
      labelIcon,
    } = props

    const {
      disabled,
      expanded,
      selected,
      focused,
      handleExpansion,
      handleSelection,
      preventSelection,
    } = useTreeItem(nodeId)

    const icon = iconProp || expansionIcon || displayIcon

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      preventSelection(event)
    }

    const handleExpansionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      handleExpansion(event)
    }

    const handleSelectionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      handleSelection(event)
    }

    return (
      <div
        className={clsx(className, classes.root, isAnyChildrenSelected ? 'children-selected' : '', {
          [classes.expanded]: expanded,
          [classes.selected]: selected,
          [classes.focused]: focused,
          [classes.disabled]: disabled,
        })}
        onMouseDown={handleMouseDown}
        ref={ref as React.Ref<HTMLDivElement>}
      >
        <div onClick={handleExpansionClick} className={classes.iconContainer}>
          {icon}
        </div>
        {labelIcon && <HBIcon type={labelIcon} size="small" />}
        <Typography onClick={handleSelectionClick} variant="caption" className={classes.label}>
          {label}
        </Typography>
        {Boolean(count && count > 0) && (
          <Typography variant="caption" className="HBTreeItem-count">
            {count}
          </Typography>
        )}
      </div>
    )
  })

  return (
    <HBTreeView
      AddComponent={({ addNode, moveNode, node, isRoot, nodes }) => (
        <Box display="flex" alignItems="center" sx={{ my: 2 }}>
          <HBButton
            sx={{ mr: 2, borderRadius: 4, height: 40, borderColor: 'grey.200' }}
            startIcon={<HBIcon type="plus" size="small" />}
            fullWidth
            variant="outlined"
            color="info"
            onClick={() => addNode(node)}
            mode="link"
          >
            افزودن
          </HBButton>
          {isRoot && (
            <Stack spacing={2} direction="row">
              <HBIconButton
                icon="angleUp"
                sx={{
                  backgroundColor: 'grey.200',
                  color: 'text.primary',
                }}
                onClick={() => setNodes(moveNode(nodes, selectedNodeId, true))}
              />
              <HBIconButton
                icon="angleDown"
                sx={{
                  backgroundColor: 'grey.200',
                  color: 'text.primary',
                }}
                onClick={() => setNodes(moveNode(nodes, selectedNodeId, false))}
              />
            </Stack>
          )}
        </Box>
      )}
      selected={selectedNodeId}
      onNodeSelect={handleSelect}
      treeItems={nodes}
      ItemComponent={CustomContent}
      {...args}
    />
  )
}

export const Primary = Template.bind({})
export const PrimaryWithStyles = Template2.bind({})
Primary.args = {}
