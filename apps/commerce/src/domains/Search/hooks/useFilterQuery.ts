import { ProductFilter } from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { NextRouter } from 'next/router'
import { stringify } from 'query-string'

export const useFilterQuery = (router: NextRouter, path: string) => {
  const handleMakeQuery = (
    filterSort: Partial<
      ProductFilter & {
        sortBy: string
        page: number
      }
    >,
  ) => {
    const queryParams = Object.entries(filterSort).reduce(
      (prev, [key, value]: [keyof ProductFilter, any]) => {
        if (
          (Boolean(value) && (value?.length > 0 || value?.toString.length > 0)) ||
          value?.min ||
          value?.max ||
          typeof value === 'object'
        ) {
          if (typeof value === 'object') prev = { ...prev, [key]: `${JSON.stringify(value)}` }
          else prev = { ...prev, [key]: value }
        }
        return prev
      },
      {},
    )

    if (queryParams) {
      router.push((path + stringify(queryParams)).replace(/&$/, ''), undefined, {
        shallow: true,
      })
    }
  }
  return { handleMakeQuery }
}
