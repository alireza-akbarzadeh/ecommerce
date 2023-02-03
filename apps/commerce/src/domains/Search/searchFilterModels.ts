import { DataType, ProductFilter } from '@hasty-bazar-commerce/services/generalDataApi.generated'

export interface ISort {
  name: string
  descendingOrder: boolean
}

export enum FilterTypeEnums {
  Category = 'category',
  Checkbox = 'checkbox',
  Rating = 'rating',
  Switch = 'switch',
  Range = 'range',
  Date = 'date',
}
export interface ISearchItem {
  name: string
  fixval?: string
  minval?: string
  maxval?: string
}

export interface IBreadCrumbs {
  id: string
  name: string
  reloadFiltersOnClick?: boolean
}

export interface IBreadCrumbsFilterItems {
  id: string
  filterItemTitle: string
  filterTitle: string
  filterName: string
  reloadFiltersOnClick?: boolean
}

interface ICollectionResponseOptionItemChildren {
  id: string
  code: string
  name: string
  imageUrl?: string
  reloadFiltersOnClick?: boolean
  breadCrumbs?: IBreadCrumbs[]
}
export interface ICollectionResponseOptionItem {
  id: string
  ids?: string[]
  name: string
  min?: number
  max?: number
  color?: string
  icon?: string
  children: ICollectionResponseOptionItemChildren[]
  imageUrl?: string
  reloadFiltersOnClick?: boolean
  breadCrumbs?: IBreadCrumbs[]
}

export interface IFilterItems {
  id: string
  ids?: string[]
  filterItemTitle: string
  filterName: string
  filterComponentType: string
  filterSet: 'generalFilters' | 'attributeFilters'
  dataTypeCode: DataType
  min: number | Date | null
  max: number | Date | null
  attributeCode?: string
  children?: IFilterItems[]
  imageUrl?: string
  isRangeFilter?: boolean
  filterTitle?: string
  reloadFiltersOnClick?: boolean
  breadCrumbs?: IBreadCrumbsFilterItems[]
}

export interface IFilter {
  filterType: string
  title: string
  name: string
  items: IFilterItems[]
  imageUrl?: string
}

export interface IFilterParams extends Partial<ProductFilter> {
  collectionId: string
  query?: string
  sortBy: string
  page: number
}
