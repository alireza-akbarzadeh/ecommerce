import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  ProductFilter,
  SortOrderType,
  useGetWebGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery,
} from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { Dispatch, SetStateAction } from 'react'

export const useFilterSortPagination = (
  setPage: Dispatch<SetStateAction<number>>,
  getProducts: (
    pageNumber: number,
    filter: ProductFilter,
    sort: SortOrderType | undefined,
    pagination: 'infinite' | 'pagination',
  ) => void,
  selectedFilters: ProductFilter,
  setPaginationMode: Dispatch<SetStateAction<'infinite' | 'pagination'>>,
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
  const { data: { data: { items: sortingItems = [] } = {} } = {} } =
    useGetWebGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery({
      ...ApiConstants,
      businessTypeCode: 1012,
      pageSize: 100,
    })

  const handleSorting = (value: string) => {
    setPage(1)
    getProducts(1, selectedFilters, +value as SortOrderType, 'infinite')
    setPaginationMode('infinite')
    handleMakeQuery({ ...selectedFilters, sortBy: value })
  }

  const handlePagination = (pageNumber: number, pagination?: 'infinite' | 'pagination') => {
    if (pageNumber > 0) {
      setPage(pageNumber)
      getProducts(pageNumber, selectedFilters, +sortBy as SortOrderType, pagination ?? 'infinite')
      if (pagination === 'pagination') {
        handleMakeQuery({ page: pageNumber, ...selectedFilters, sortBy })
      }
    }
  }

  return { handleSorting, handlePagination, sortingItems }
}
