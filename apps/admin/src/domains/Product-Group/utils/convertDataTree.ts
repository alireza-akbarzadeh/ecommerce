import { GetCategoriesQueryResult } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { RenderTree } from '@hasty-bazar/core'

export let maxExpandedLevel = 1

export function convertDataTree(data: GetCategoriesQueryResult[] | null): Array<any> {
  const returnData: RenderTree[] = []
  data?.forEach((item: GetCategoriesQueryResult) => {
    const level = (item?.path?.split?.('/')?.length || 3) - 2
    if (level > maxExpandedLevel) {
      maxExpandedLevel = level
    }
    returnData.push({
      id: String(item.id),
      pid: item?.parentId ? String(item?.parentId) : null,
      name: item.name ?? '',
      icon: item?.iconPath ? (String(item?.iconPath) as any) : 'picture',
      stateCode: item?.stateCode,
      level,
    })
  })
  return returnData
}

export function convertDataTreeAfterSearch(
  data: GetCategoriesQueryResult[] | null,
  oldList: GetCategoriesQueryResult[] | null,
): Array<any> {
  let returnData: RenderTree[] = []
  data?.forEach((item: GetCategoriesQueryResult) => {
    returnData.push({
      id: String(item.id),
      pid: item?.parentId ? String(item?.parentId) : null,
      name: item.name ?? '',
      icon: item?.iconPath ? (String(item?.iconPath) as any) : 'picture',
      stateCode: item?.stateCode,
    })
    let paths = item?.path?.split?.('/')
    paths = paths?.slice(1, paths?.length - 2)
    paths?.forEach((path) => {
      const patentItem: GetCategoriesQueryResult | undefined = oldList?.find((x) => x.id === path)
      returnData.push({
        id: String(patentItem?.id),
        pid: patentItem?.parentId ? String(patentItem?.parentId) : null,
        name: patentItem?.name ?? '',
        icon: patentItem?.iconPath ? (String(patentItem?.iconPath) as any) : 'picture',
        stateCode: item?.stateCode,
      })
    })
  })

  returnData = returnData.filter(
    (value, index, self) => self.findIndex((v) => v.id === value.id) === index,
  )

  return returnData
}
