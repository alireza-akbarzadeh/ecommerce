import { HBClassesType } from '@hasty-bazar/core'
import { GetCategoriesQueryResult } from '@hasty-bazar/admin-shared/services/catalogApi.generated'

type HBPageClassNames = 'container'

export const classes: HBClassesType<HBPageClassNames> = {
  container: {
    width: '100%',
    height: 'calc(100vh - 120px)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
}

export type IProductGroupsFormTypes = Omit<GetCategoriesQueryResult, 'displaySortTypeCode'> & {
  attributesCount?: number
  iconPath?: string
  parentName?: string
  stateCode?: string
  stateName?: string
  isAllocatableToProduct?: boolean
  displaySortTypeCode?: string | number | null
  sellerLimitationTypeCode?: any
  displayOrderTypeCode?: any
  commisionLawId?: any
  returnLawId?: any
  displayExtractTypeCode?: any
  screenDisplayId?: any
  collectionId?: any
}
