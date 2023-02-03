import {
  GetPagePartQueryResult,
  GetPagesQueryResult,
  SectionQueryResult,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { RenderTree } from '@hasty-bazar/core'

function treeDataToFlat(
  treeData: GetPagesQueryResult[],
  options: {
    firstLevelPrefix: string
    secondLevelPrefix: string
  },
): RenderTree[] {
  const firstLevel = fewArrayToOne(
    treeData.map((item) => {
      return item.pageParts?.map((part) => {
        return {
          id: options.firstLevelPrefix + part.id,
          pid: item.id,
          name: part.name,
          icon: '',
          isExtendable: part.isExtendable,
          sort: part.sort,
          stateCode: item?.stateCode,
          level: 2,
        }
      })
    }),
  )

  const secondLevel = fewArrayToOne(
    fewArrayToOne<any>(
      treeData.map((item) => {
        return item.pageParts?.map((part) => {
          return part.sections?.map((section) => {
            return {
              id: options.secondLevelPrefix + section.id,
              pid: options.firstLevelPrefix + part.id,
              name: section.name,
              icon: '',
              rowIndex: section.rowIndex,
              displaySortOrder: section.displaySortOrder,
              stateCode: item?.stateCode,
              level: 3,
            }
          })
        })
      }) || [],
    ),
  )

  const mainLevel = treeData.map((item) => {
    return {
      id: item.id,
      pid: null,
      name: item.name,
      icon: '',
      isExtendable: item.isExtendable,
      stateCode: item?.stateCode,
      level: 1,
    }
  })
  return [
    ...mainLevel.sort(mainLevelSort),
    ...firstLevel.sort(firstLevelSort),
    ...secondLevel.sort(secondLevelSort),
  ] as RenderTree[]
}
function fewArrayToOne<T>(arr: any[]): T[] {
  const result: T[] = []
  arr.forEach((item) => {
    result.push(...item)
  })
  return result
}

const mainLevelSort = (a: GetPagesQueryResult, b: GetPagesQueryResult) => {
  if (a.id! > b.id!) {
    return 1
  }
  if (a.id! < b.id!) {
    return -1
  }
  return 0
}

const firstLevelSort = (a: GetPagePartQueryResult, b: GetPagePartQueryResult) => {
  if (a.sort! > b.sort!) {
    return 1
  }
  if (a.sort! < b.sort!) {
    return -1
  }

  return 0
}

const secondLevelSort = (a: SectionQueryResult, b: SectionQueryResult) => {
  if (a.rowIndex! > b.rowIndex!) {
    return 1
  }
  if (a.rowIndex! < b.rowIndex!) {
    return -1
  }
  if (a.rowIndex! == b.rowIndex!) {
    if (a.displaySortOrder! > b.displaySortOrder!) {
      return 1
    }
    if (a.displaySortOrder! < b.displaySortOrder!) {
      return -1
    }
  }
  return 0
}

export { treeDataToFlat }
