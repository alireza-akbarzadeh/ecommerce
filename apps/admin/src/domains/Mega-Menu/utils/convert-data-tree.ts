import { RenderTree } from '@hasty-bazar/core'

export let maxExpandedLevel = 1

export function convertDataTree(data: any): Array<any> {
  return (
    data?.map(({ title = '', parentId = '', id = '', path = '' } = {}): RenderTree => {
      const level = (path?.split?.('/')?.length || 3) - 2
      if (level > maxExpandedLevel) {
        maxExpandedLevel = level
      }
      return {
        id: String(id),
        pid: parentId ? String(parentId) : null,
        name: title ?? '',
        icon: 'picture',
        level,
      }
    }) || []
  )
}
