import { ProductFilter } from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { NextRouter } from 'next/router'
import { isEmpty } from 'ramda'
import { Dispatch, SetStateAction, useMemo } from 'react'
import { IFilterParams } from '../searchFilterModels'

export const useSelectedFilter = (
  router: NextRouter,
  params: IFilterParams,
  setPage: Dispatch<SetStateAction<number>>,
  setPaginationMode: Dispatch<SetStateAction<'infinite' | 'pagination'>>,
) => {
  const selectedFilters = useMemo((): ProductFilter => {
    const queryFilters = router.query
    if (params?.page) {
      setPage(+params.page)
      setPaginationMode('pagination')
    }
    delete queryFilters.collectionId
    delete queryFilters.query
    delete queryFilters.sortBy
    delete queryFilters.page
    let filter: ProductFilter = Object.entries(queryFilters).reduce(
      (prev, [key, value]: [keyof ProductFilter, any]) => {
        if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
          prev = { ...prev, [key]: JSON.parse(value) }
        } else prev = { ...prev, [key]: value }
        return prev
      },
      {},
    )
    const baseFilter = filter.baseFilter?.brands
      ? {
          ...filter.baseFilter,
          brands: Array.isArray(filter.baseFilter?.brands)
            ? [...new Set([...filter.baseFilter?.brands])]
            : //@ts-ignore
              filter.baseFilter.brands?.split(','),
        }
      : { ...filter.baseFilter }

    filter = {
      ...{
        ...filter,
        baseFilter,
      },
      categories: [
        ...new Set([
          ...(filter?.categories ?? []),
          ...((!filter?.categories?.length && filter.baseFilter?.categories) || []),
        ]),
      ],
      brands: [...new Set([...(filter?.brands ?? []), ...(filter.baseFilter?.brands ?? [])])],
      vendors: [...new Set([...(filter?.vendors ?? []), ...(filter.baseFilter?.vendors ?? [])])],
    }
    Object.keys(filter).forEach(
      (k: keyof ProductFilter) =>
        (filter[k] === null || (filter[k] as string[]).length === 0 || isEmpty(filter[k])) &&
        delete filter[k],
    )
    return filter
  }, [router])
  return { selectedFilters }
}
