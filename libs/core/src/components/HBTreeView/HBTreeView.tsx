import { TreeItem, TreeItemContentProps, TreeItemProps, TreeViewProps } from '@mui/lab'
import { Box } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import {
  findNodeLevels,
  flatToNested,
  getNestedPath,
  moveNode,
  replaceNodeInTree,
} from '../../utils/nodes'
import { HBIcon, HBIconType } from '../HBIcon'
import { HBTreeViewRootStyle } from './HBTreeView.styles'

export type RenderTree = {
  id: string
  pid: string | null
  name: string
  icon: HBIconType
  children?: RenderTree[]
  stateCode?: string | null | undefined | null
  level?: number | undefined
}

export type ItemComponentProps = TreeItemContentProps & {
  count?: number
  isAnyChildrenSelected?: boolean
  labelIcon?: HBIconType
  stateCode?: string | null
  addNode?: (node: RenderTree, addName?: string, icon?: HBIconType) => void
  onClickAddChild?: (id: string) => void
  unVisibleAddButton?: (id: string) => boolean
}

export type HBTreeViewProps = TreeViewProps & {
  onAddNode?: (node: RenderTree) => void
  AddComponent?: ({
    addNode,
    moveNode,
    node,
    nodes,
    isRoot,
    selectedNodeId,
  }: {
    addNode: (node: RenderTree, addName?: string, icon?: HBIconType) => void
    moveNode: (nodes: RenderTree[], selectedNodeId: string, orientation: boolean) => RenderTree[]
    node: RenderTree
    nodes: RenderTree[]
    isRoot: boolean
    selectedNodeId: string
  }) => JSX.Element
  treeItems: RenderTree[]
  ItemComponent: (props: ItemComponentProps) => JSX.Element
  selected: string
  onNodeSelect: (event: React.SyntheticEvent, nodeId: string) => void
  onClickAddChild?: (id: string) => void
  unVisibleAddButton?: (id: string) => boolean
}

const CustomTreeItem = (
  props: TreeItemProps & {
    ContentProps: {
      count: number
      isAnyChildrenSelected: boolean
      labelIcon: HBIconType
      addNode?: (node: RenderTree, addName?: string, icon?: HBIconType) => void
      onClickAddChild?: (id: string) => void
      unVisibleAddButton?: (id: string) => boolean
      stateCode?: string | null
    }
  },
) => {
  return <TreeItem {...props} />
}

const renderTree = (
  nodes: RenderTree[],
  selectedNodeId: string,
  ItemComponent: HBTreeViewProps['ItemComponent'],
  addNode?: (node: RenderTree, addName?: string, icon?: HBIconType) => void,
  AddComponent?: HBTreeViewProps['AddComponent'],
  onClickAddChild?: (id: string) => void,
  unVisibleAddButton?: (id: string) => boolean,
) => {
  const checkIfChildrenSelected = (
    nodes: RenderTree[],
    selectedNodeId: string,
    currentNodeId: string,
  ): boolean => {
    const path = getNestedPath(nodes, selectedNodeId)
    const result = path ? path.split('/').includes(currentNodeId) : false
    return result
  }

  return nodes.map((node: RenderTree, index: number) => (
    <Box key={node.id}>
      <CustomTreeItem
        nodeId={node.id}
        label={node.name}
        ContentProps={{
          count: node.children?.length || 0,
          isAnyChildrenSelected: checkIfChildrenSelected(nodes, selectedNodeId, node.id),
          onClickAddChild,
          unVisibleAddButton,
          stateCode: node?.stateCode,
          labelIcon: node.icon,
          addNode,
        }}
        ContentComponent={ItemComponent}
      >
        {AddComponent && addNode && (
          <AddComponent
            addNode={addNode}
            moveNode={moveNode}
            node={node}
            nodes={nodes}
            isRoot={node.pid === null}
            selectedNodeId={selectedNodeId}
          />
        )}
        {Array.isArray(node.children)
          ? renderTree(
              node.children,
              selectedNodeId,
              ItemComponent,
              addNode,
              AddComponent,
              onClickAddChild,
              unVisibleAddButton,
            )
          : null}
      </CustomTreeItem>
    </Box>
  ))
}

const HBTreeView = (props: HBTreeViewProps) => {
  const {
    treeItems,
    defaultCollapseIcon,
    defaultExpandIcon,
    selected,
    AddComponent,
    ItemComponent,
    onAddNode,
    onClickAddChild,
    unVisibleAddButton,
    ...otherProps
  } = props

  const [nodes, setNodes] = useState<RenderTree[]>()

  useEffect(() => {
    setNodes(treeItems)
  }, [treeItems])

  const checkIfNested = (nodes: RenderTree[]) =>
    nodes.some((node) => node.children && node.children.length > 0)

  const nestedTreeItems = useMemo(
    () => (nodes && checkIfNested(nodes) ? nodes : nodes && flatToNested(nodes)),
    [nodes],
  )

  const addNode = (node: RenderTree, addName?: string, icon?: HBIconType) => {
    if (nestedTreeItems) {
      const newNode: RenderTree = {
        id: Math.floor(Math.random() / 10000000).toString(),
        pid: node.pid,
        name: node.pid ?? 'کشور',
        icon: node.icon ?? 'camera',
      }
      let nodeLevels = findNodeLevels(nestedTreeItems, node)
      if (!nodeLevels) return
      const isRoot = node.pid === null
      nodeLevels.unshift(newNode)
      const test = replaceNodeInTree(nestedTreeItems, nodeLevels)
      setNodes(isRoot ? nodeLevels : test)
      onAddNode && onAddNode(node)
    }
  }

  const [expanded, setExpanded] = useState<string[]>([])

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds)
  }

  useEffect(() => {
    setExpanded(otherProps?.expanded || [])
  }, [otherProps?.expanded])

  return (
    // @ts-ignore
    <HBTreeViewRootStyle
      {...otherProps}
      defaultCollapseIcon={<HBIcon type="angleDown" size="small" />}
      defaultExpandIcon={<HBIcon type="angleLeft" size="small" />}
      expanded={expanded}
      onNodeToggle={handleToggle}
      selected={selected as string | undefined}
    >
      {nestedTreeItems &&
        renderTree(
          nestedTreeItems,
          selected as string,
          ItemComponent,
          addNode,
          AddComponent,
          onClickAddChild,
          unVisibleAddButton,
        )}
      {props.children}
    </HBTreeViewRootStyle>
  )
}

HBTreeView.displayName = 'HBTreeView'
HBTreeView.defaultProps = {}

export default HBTreeView
