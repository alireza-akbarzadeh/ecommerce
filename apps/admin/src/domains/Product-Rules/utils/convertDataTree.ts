import { GetProcessesTreeQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { RenderTree } from '@hasty-bazar/core'

export function convertDataTree(data: GetProcessesTreeQueryResult[]): Array<RenderTree> {
  const returnData: RenderTree[] = []
  data?.forEach((item) => {
    returnData.push({
      id: String(item.processMethodTypeCode),
      pid: null,
      name: item.processMethodTypeTitle ?? '',
      icon: 'picture',
    })

    item?.treeEventList?.forEach((itemTreeEvent) => {
      returnData.push({
        id: String(itemTreeEvent.eventName),
        pid: String(item.processMethodTypeCode),
        name: itemTreeEvent.title ?? '',
        icon: 'picture',
      })
    })
  })
  return returnData
}
