import { RenderTree } from '../components/HBTreeView'

export const flatToNested = (items: RenderTree[], id: string | null = null): RenderTree[] => {
  return items
    .filter((item) => item.pid === id)
    .map((item) => ({ ...item, children: flatToNested(items, item.id) }))
}

export const arrayMoveItem = <T>(arr: T[], fromIndex: number, toIndex: number): T[] => {
  const element = arr[fromIndex]
  arr.splice(fromIndex, 1)
  arr.splice(toIndex, 0, element)
  return arr
}

export const findItemNested = (arr: RenderTree[], itemId: string): RenderTree | null =>
  arr.reduce<RenderTree | null>((a, item) => {
    if (a) return a
    if (item.id === itemId) return item
    if (item.children) return findItemNested(item.children, itemId)
    return null
  }, null)

export const findNodeLevels = (
  nodes: RenderTree[],
  currentNode: RenderTree,
): RenderTree[] | null => {
  return nodes.reduce<RenderTree[] | null>((prev, node) => {
    if (prev) return prev
    if (node.pid === currentNode.pid) return [...nodes]
    if (node.children && node.children.length > 0) return findNodeLevels(node.children, currentNode)
    return null
  }, null)
}

export const replaceNodeInTree = (
  nodes: RenderTree[],
  changedNodes: RenderTree[],
): RenderTree[] => {
  const targetPid = changedNodes[0].pid
  return nodes.map((node) => {
    return {
      id: node.id,
      pid: node.pid,
      name: node.name,
      icon: node.icon,
      ...(node.children &&
        node.children.length > 0 && {
          children:
            targetPid === node.id ? changedNodes : replaceNodeInTree(node.children, changedNodes),
        }),
    }
  })
}

export const getNestedPath = (nodes: RenderTree[], id: string): string | void => {
  for (const node of nodes) {
    if (node.id === id) return `/${id}`
    if (node.children && node.children.length > 0) {
      const child = getNestedPath(node.children, id)
      if (child) return `/${node.id}${child}`
    }
  }
}

export const moveNode = (
  nodes: RenderTree[],
  selectedNodeId: string,
  orientation = true,
): RenderTree[] => {
  const selectedNode = findItemNested(nodes, selectedNodeId)
  if (!selectedNode) return nodes
  const selectedLevelNodes = findNodeLevels(nodes, selectedNode)
  if (!selectedLevelNodes) return nodes
  const selectedNodeIndex = selectedLevelNodes.findIndex((item) => item.id === selectedNode.id)
  const limitIndex = orientation ? 0 : selectedLevelNodes.length - 1
  const targetIndexDifference = orientation ? -1 : 1
  const isRootNode = selectedNode.pid === null
  if (selectedNodeIndex === limitIndex) return nodes
  const completeMovedNode = arrayMoveItem<RenderTree>(
    selectedLevelNodes,
    selectedNodeIndex,
    selectedNodeIndex + targetIndexDifference,
  )
  const test = replaceNodeInTree(nodes, completeMovedNode)
  return isRootNode ? completeMovedNode : test
}
