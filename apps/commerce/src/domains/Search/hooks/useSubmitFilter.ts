import {
  AttributeFilter,
  ProductFilter,
  SortOrderType,
} from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { isEmpty } from 'ramda'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { IFilterItems } from '../searchFilterModels'

export const useSubmitFilter = (
  selectedFilters: ProductFilter,
  getFilterData: (filter?: ProductFilter) => void,
  setPage: Dispatch<SetStateAction<number>>,
  setPaginationMode: Dispatch<SetStateAction<'infinite' | 'pagination'>>,
  handleMakeQuery: (
    filterSort: Partial<
      ProductFilter & {
        sortBy: string
        page: number
      }
    >,
  ) => void,
  getProducts: (
    pageNumber: number,
    filter: ProductFilter,
    sort: SortOrderType | undefined,
    pagination: 'infinite' | 'pagination',
  ) => void,
  sortBy: string,
) => {
  const attributeHandler = useCallback(
    (v: IFilterItems): AttributeFilter[] | null | undefined => {
      let selectedAttributes = selectedFilters?.attributes ?? []
      const index = selectedAttributes?.findIndex((item) => item.attributeCode === v.attributeCode)

      if (index !== -1) {
        if (
          !v.isRangeFilter &&
          selectedAttributes[index]?.values?.some((item: string) => item === v.id)
        ) {
          selectedAttributes[index].values =
            selectedAttributes[index]?.values?.filter((item: string) => item !== v.id) ?? []
          if (selectedAttributes[index].values?.length === 0)
            selectedAttributes = selectedAttributes.filter(
              (attr) => attr.attributeCode !== selectedAttributes[index].attributeCode,
            )
          return selectedAttributes
        }

        if (!v.isRangeFilter) {
          if (v.id) {
            selectedAttributes[index]?.values?.push(v.id)
          } else {
            selectedAttributes[index] = {
              attributeCode: v.attributeCode,
              values: [],
              dataTypeCode: v.dataTypeCode,
              min: v.min,
              max: v.max,
            }
          }
          return selectedAttributes
        }

        if (
          v.isRangeFilter &&
          Boolean(v?.ids?.every?.((v) => selectedAttributes[index]?.values?.includes?.(v)))
        ) {
          const res = selectedAttributes[index]?.values?.filter((item) => !v?.ids?.includes(item))
          if (res?.length === 0)
            selectedAttributes = selectedAttributes.filter(
              (item) => item.attributeCode !== v.attributeCode,
            )
          else selectedAttributes[index].values = res
          return selectedAttributes
        }

        if (v.isRangeFilter) {
          selectedAttributes[index]?.values?.push(...(v.ids ?? []))
          return selectedAttributes
        }
      } else {
        return (selectedAttributes = [
          ...selectedAttributes,
          {
            attributeCode: v.attributeCode,
            values: v.isRangeFilter ? v.ids : v.id ? [v.id] : [],
            dataTypeCode: v.dataTypeCode,
            min: v.min,
            max: v.max,
          },
        ])
      }
    },
    [selectedFilters],
  )
  const handleSubmitFilters = (v: IFilterItems) => {
    const filterSelector: Partial<ProductFilter> = {
      categories: v.id ? [v.id] : null,
      price: {
        min: v.min ? Number(v.min) : v.min,
        max: v.max ? Number(v.max) : v.max,
      },
      acceptableConditionTypes: selectedFilters?.acceptableConditionTypes?.some(
        (item) => +item === +v.id,
      )
        ? selectedFilters?.acceptableConditionTypes?.filter((item) => item !== +v.id)
        : [...(selectedFilters?.acceptableConditionTypes ?? []), +v.id],
      vendors: selectedFilters?.vendors?.some((item: string) => item === v.id)
        ? selectedFilters?.vendors?.filter((item: string) => item !== v.id)
        : [...(selectedFilters?.vendors ?? []), v.id],
      productRate:
        selectedFilters?.productRate?.min === v.min
          ? undefined
          : {
              min: Number(v.min),
            },
      releasedDays: +v.id,
      booleanProductFilters: selectedFilters?.booleanProductFilters?.some(
        (item: string) => item === v.id,
      )
        ? selectedFilters?.booleanProductFilters?.filter((item: string) => item !== v.id)
        : [...(selectedFilters?.booleanProductFilters ?? []), v.id],
      baseFilter: selectedFilters.baseFilter,
      brands: selectedFilters?.brands?.some((item: string) => item === v.id)
        ? selectedFilters?.brands?.filter((item: string) => item !== v.id)
        : [...(selectedFilters?.brands ?? []), v.id],
      attributes: attributeHandler(v),
    }

    let newSelectedFilters = {
      ...selectedFilters,
    }

    // Remove empty filter keys
    newSelectedFilters[v.filterName as keyof ProductFilter] = filterSelector[
      v.filterName as keyof ProductFilter
    ] as any
    Object.keys(newSelectedFilters).forEach(
      (k: keyof ProductFilter) =>
        (newSelectedFilters[k] === null ||
          (newSelectedFilters[k] as string[])?.length === 0 ||
          isEmpty(newSelectedFilters[k])) &&
        delete newSelectedFilters[k],
    )

    if (v.filterName === 'categories' && v.reloadFiltersOnClick) {
      newSelectedFilters = { baseFilter: { categories: [v.id] }, categories: [v.id] }
      getFilterData(newSelectedFilters)
    }

    setPage(1)
    setPaginationMode('infinite')
    handleMakeQuery({ page: undefined, ...newSelectedFilters, sortBy })
    getProducts(1, newSelectedFilters, +sortBy as SortOrderType, 'infinite')
  }

  return {
    handleSubmitFilters,
  }
}
