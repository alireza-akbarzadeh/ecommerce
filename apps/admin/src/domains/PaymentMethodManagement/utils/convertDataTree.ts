import { PaymentMethodDto } from '@hasty-bazar/admin-shared/services/paymentApi.generated'
import { RenderTree } from '@hasty-bazar/core'

export let maxExpandedLevel = 2

export function convertDataTree(data: PaymentMethodDto[]): Array<any> {
  const returnData: RenderTree[] = []
  data?.forEach((item) => {
    returnData.push({
      id: String(item.paymentMethodId),
      pid: null,
      name: item.title ?? '',
      icon: (item.icon as any) || 'picture',
      level: 1,
    })

    item?.paymentProviders?.forEach((itemTreeEvent) => {
      returnData.push({
        id: String(itemTreeEvent.paymentProviderId),
        pid: String(item.paymentMethodId),
        name: itemTreeEvent.title ?? '',
        icon: (itemTreeEvent.icon as any) || 'picture',
        level: 2,
      })
    })
  })
  return returnData
}
