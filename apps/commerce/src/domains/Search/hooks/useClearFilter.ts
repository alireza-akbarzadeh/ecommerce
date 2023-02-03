import {
  ProductFilter,
  SortOrderType,
} from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { NextRouter } from 'next/router'
import { stringify } from 'query-string'
import { Dispatch, SetStateAction } from 'react'
import { useDispatch } from 'react-redux'
import { clearAllFilterItems, clearFilterItemsGroup } from '../SearchFilter.reducer'
import { IFilterItems } from '../searchFilterModels'

export const useClearFilter = (
  selectedFilters: ProductFilter,
  router: NextRouter,
  path: string,
  setPage: Dispatch<SetStateAction<number>>,
  setPaginationMode: Dispatch<SetStateAction<'infinite' | 'pagination'>>,
  getProducts: (
    pageNumber: number,
    filter: ProductFilter,
    sort: SortOrderType | undefined,
    pagination: 'infinite' | 'pagination',
  ) => void,
  sortBy: string,
  handleMakeQuery: (
    filterSort: Partial<
      ProductFilter & {
        sortBy: string
        page: number
      }
    >,
  ) => void,
) => {
  const dispatch = useDispatch()
  const resetFilter = () => {
    const baseFilterQuery = selectedFilters.baseFilter
      ? stringify({ baseFilter: JSON.stringify(selectedFilters.baseFilter ?? {}) })
      : ''
    router.push(path + baseFilterQuery, undefined, {
      shallow: true,
    })
    setPage(1)
    setPaginationMode('infinite')
    dispatch(clearAllFilterItems())
    getProducts(1, { baseFilter: selectedFilters.baseFilter }, undefined, 'infinite')
  }

  const clearFilterGroup = (filter: IFilterItems) => {
    if (filter.filterName === 'attributes') {
      selectedFilters.attributes = selectedFilters.attributes?.filter(
        (attr) => attr.attributeCode !== filter.attributeCode,
      )
    } else {
      delete selectedFilters[filter.filterName as keyof ProductFilter]
    }
    setPage(1)
    setPaginationMode('infinite')
    handleMakeQuery({ ...selectedFilters, page: 1, sortBy })
    dispatch(clearFilterItemsGroup(filter))
    getProducts(1, selectedFilters, undefined, 'infinite')
  }

  return { resetFilter, clearFilterGroup }
}
