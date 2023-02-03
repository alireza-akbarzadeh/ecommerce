import { GetProcessesTreeQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { RenderTree } from '@hasty-bazar/core'

export let maxExpandedLevel = 2

export function convertDataTree(data: GetProcessesTreeQueryResult[]): Array<any> {
  const returnData: RenderTree[] = []
  data?.forEach((item) => {
    returnData.push({
      id: String(item.processMethodTypeCode),
      pid: null,
      name: item.processMethodTypeTitle ?? '',
      icon: 'picture',
      level: 1,
    })

    item?.treeEventList?.forEach((itemTreeEvent) => {
      returnData.push({
        id: String(itemTreeEvent.id),
        pid: String(item.processMethodTypeCode),
        name: itemTreeEvent.title ?? '',
        icon: 'picture',
        stateCode: String(itemTreeEvent?.statusId),
        level: 2,
      })
    })
  })
  return returnData
}
