import { HBSelectTreeDataProps } from './HBSelectTree'

const flatListToTreeList = (listData: HBSelectTreeDataProps[]): HBSelectTreeDataProps[] => {
  const list = JSON.parse(JSON.stringify(listData)) as HBSelectTreeDataProps[]
  const root: HBSelectTreeDataProps[] = []
  const map: { [key: string]: HBSelectTreeDataProps } = {}
  list.forEach((item) => {
    map[item.id] = item
  })
  list.forEach((item) => {
    if (item.parentId && list.find((f) => f.id === item.parentId)) {
      const parent = map[item.parentId]
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        if (!parent.children.find((f) => f.id === item.id)) parent.children.push(item)
      }
    } else {
      if (!root.find((f) => f.id === item.id)) root.push(item)
    }
  })
  return root
}

const createChildrenList = (
  listData: HBSelectTreeDataProps[],
  parentId: string,
): HBSelectTreeDataProps[] => {
  const list = JSON.parse(JSON.stringify(listData)) as HBSelectTreeDataProps[]
  const children: HBSelectTreeDataProps[] = []
  list.forEach((item) => {
    if (item.parentId === parentId) {
      item.children = createChildrenList(listData, item.id)
      children.push(item)
    }
  })
  return children
}

function searchTree(dataList: HBSelectTreeDataProps[], search: string): HBSelectTreeDataProps[] {
  return dataList
    .filter((item) => {
      if (item.label.includes(search)) return true
      return false
    })
    .map((item) => {
      item.children = createChildrenList(dataList, item.id)
      return item
    })
}

function getParentIds(data: HBSelectTreeDataProps[], childId: string): string[] {
  const parentIds = []
  let parentId = data.find((item) => item.id === childId)?.parentId
  while (parentId) {
    parentIds.push(parentId)
    parentId = data.find((item) => item.id === parentId)?.parentId
  }
  return parentIds
}

export { getParentIds, searchTree, flatListToTreeList, createChildrenList }
