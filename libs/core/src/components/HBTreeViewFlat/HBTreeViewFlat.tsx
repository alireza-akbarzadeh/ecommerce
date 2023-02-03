import { TreeItem, TreeItemContentProps, TreeItemProps, TreeViewProps } from '@mui/lab'
import { Typography } from '@mui/material'
import { FC, useMemo } from 'react'
import { HBIcon } from '../HBIcon'
import { HBTreeViewRootStyle } from '../HBTreeView/HBTreeView.styles'
import CustomContent from './HBTreeViewFlatItem'
import { listToTree, listToTreeProps, listToTreeReturnType } from './utils'

export type HBTreeViewFlatProps<DataStructure> = TreeViewProps & {
  selectedNode?: DataStructure
  list: DataStructure[]
  listToTreeProps: listToTreeProps<DataStructure>
  AddComponents?: (props: listToTreeReturnType<DataStructure>) => JSX.Element
  TreeItemCustomComponents?: (props: TreeItemContentProps) => JSX.Element
}
type CustomTreeItem = TreeItemProps & {
  ContentProps: {
    TreeItemCustomComponents?: (props: TreeItemContentProps) => JSX.Element
  }
}
const CustomTreeItem: FC<CustomTreeItem> = (props) => {
  return <TreeItem {...props} />
}
const HBTreeViewFlat = <DataStructure,>({
  selectedNode,
  list,
  listToTreeProps,
  AddComponents,
  TreeItemCustomComponents,
  ...otherProps
}: HBTreeViewFlatProps<DataStructure>) => {
  const renderTree = (nodes: listToTreeReturnType<DataStructure>): JSX.Element => (
    <CustomTreeItem
      ContentComponent={CustomContent}
      ContentProps={{ TreeItemCustomComponents }}
      key={String(nodes.value)}
      nodeId={String(nodes.value)}
      label={<Typography>{nodes.title}</Typography>}
    >
      {AddComponents && <AddComponents {...nodes} />}
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </CustomTreeItem>
  )
  const tree = useMemo(() => listToTree<DataStructure>(list, listToTreeProps), [list])
  return (
    <HBTreeViewRootStyle
      defaultCollapseIcon={<HBIcon type="angleDown" size="small" />}
      defaultExpandIcon={<HBIcon type="angleLeft" size="small" />}
      {...otherProps}
    >
      {tree.map((item) => renderTree(item))}
    </HBTreeViewRootStyle>
  )
}

HBTreeViewFlat.displayName = 'HBTreeViewFlat'
HBTreeViewFlat.defaultProps = {}

export default HBTreeViewFlat
