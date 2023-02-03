import {
  DataType,
  FacetsApiResult,
  ProductAttributeFacet,
  ProductFilterFacet,
} from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { camelize } from '@hasty-bazar/utils'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import SearchMessages from '../Search.messages'
import {
  FilterTypeEnums,
  IBreadCrumbsFilterItems,
  ICollectionResponseOptionItem,
  IFilter,
  IFilterItems,
} from '../searchFilterModels'

export const useFilterItems = (filterData?: FacetsApiResult) => {
  const { formatMessage } = useIntl()

  const filterType = (filterName?: number) => {
    switch (filterName) {
      case 1017013:
        return FilterTypeEnums.Category
      case 1017009:
        return FilterTypeEnums.Rating
      case 1017001:
        return FilterTypeEnums.Range
      case 1017006:
        return FilterTypeEnums.Range
      case 1017002:
        return FilterTypeEnums.Date
      default:
        return FilterTypeEnums.Checkbox
    }
  }

  const handlePriceValue = (idx: number, length: number, min?: number, max?: number) => {
    if (idx === 0) {
      return (
        formatMessage(SearchMessages.lower) +
        ' ' +
        (max ?? 0).toLocaleString() +
        ' ' +
        formatMessage(SearchMessages.toman)
      )
    }
    if (idx === length - 1) {
      return (
        formatMessage(SearchMessages.upper) +
        ' ' +
        (min ?? 0).toLocaleString() +
        ' ' +
        formatMessage(SearchMessages.toman)
      )
    }
    return (
      (min ?? 0).toLocaleString() +
      ' ' +
      formatMessage(SearchMessages.until) +
      ' ' +
      (max ?? 0).toLocaleString() +
      ' ' +
      formatMessage(SearchMessages.toman)
    )
  }

  const handleGeneralFilters = () => {
    return (
      filterData?.data?.generalFilters?.map((generalFilter: ProductFilterFacet): IFilter => {
        return {
          filterType: filterType(Number(generalFilter?.dataTypeCode)),
          title: generalFilter?.title ?? '',
          name: camelize(generalFilter?.name ?? ''),
          items:
            generalFilter?.options?.items?.map(
              (item: ICollectionResponseOptionItem, idx: number, items: any[]): IFilterItems => ({
                id:
                  generalFilter?.name === 'Price' || generalFilter?.name === 'ProductRate'
                    ? `${item.min}-${item.max}`
                    : !generalFilter?.isRangeFilter
                    ? item.id
                    : '',
                ids: generalFilter?.isRangeFilter ? item.ids : [],
                filterItemTitle:
                  generalFilter?.name === 'Price'
                    ? handlePriceValue(idx, items.length, item.min, item.max)
                    : item.name,
                filterName: camelize(generalFilter?.name ?? ''),
                filterComponentType: filterType(Number(generalFilter?.dataTypeCode)),
                filterSet: 'generalFilters',
                dataTypeCode: generalFilter?.dataTypeCode as DataType,
                min: item?.min ?? null,
                max: item?.max ?? null,
                imageUrl: item.imageUrl ?? '',
                isRangeFilter: Boolean(generalFilter?.isRangeFilter),
                filterTitle: generalFilter?.title ?? '',
                reloadFiltersOnClick: item?.reloadFiltersOnClick ?? false,
                breadCrumbs: item.breadCrumbs?.map(
                  (item) =>
                    ({
                      id: item.id,
                      filterItemTitle: item.name,
                      filterName: camelize(generalFilter?.name ?? ''),
                      reloadFiltersOnClick: item.reloadFiltersOnClick,
                      filterTitle: generalFilter?.title ?? '',
                    } as IBreadCrumbsFilterItems),
                ),
                children: item?.children?.map?.((child) => ({
                  id: child?.id ?? '',
                  filterItemTitle: child?.name,
                  filterName: camelize(generalFilter?.name ?? ''),
                  filterComponentType: filterType(Number(generalFilter?.dataTypeCode)),
                  filterSet: 'generalFilters',
                  dataTypeCode: generalFilter?.dataTypeCode as DataType,
                  min: null,
                  max: null,
                  imageUrl: child?.imageUrl ?? '',
                  isRangeFilter: Boolean(generalFilter?.isRangeFilter),
                  filterTitle: generalFilter?.title ?? '',
                  reloadFiltersOnClick: child?.reloadFiltersOnClick ?? false,
                  breadCrumbs: child?.breadCrumbs?.map(
                    (item) =>
                      ({
                        id: item.id,
                        filterItemTitle: item.name,
                        filterName: camelize(generalFilter?.name ?? ''),
                        reloadFiltersOnClick: item.reloadFiltersOnClick,
                        filterTitle: generalFilter?.title ?? '',
                      } as IBreadCrumbsFilterItems),
                  ),
                })),
              }),
            ) ?? [],
        }
      }) ?? []
    )
  }

  const handleExclusiveFilters = () => {
    return (
      filterData?.data?.attributeFilters?.map(
        (attributeFilter: ProductAttributeFacet): IFilter => ({
          filterType: filterType(Number(attributeFilter?.dataTypeCode)),
          title: attributeFilter?.name ?? '',
          name: attributeFilter?.code ?? '',
          items:
            attributeFilter?.options?.items?.map(
              (item: ICollectionResponseOptionItem): IFilterItems => ({
                id:
                  attributeFilter?.dataTypeCode === 1017009 ||
                  attributeFilter?.dataTypeCode === 1017001 ||
                  attributeFilter?.dataTypeCode === 1017006
                    ? `${item.min}-${item.max}`
                    : !attributeFilter?.isRangeFilter
                    ? item?.id
                    : '',
                ids: attributeFilter?.isRangeFilter ? item?.ids : [],
                filterItemTitle: item?.name,
                attributeCode: attributeFilter?.code ?? '',
                filterName: 'attributes',
                filterComponentType: filterType(Number(attributeFilter?.dataTypeCode)),
                filterSet: 'attributeFilters',
                dataTypeCode: attributeFilter?.dataTypeCode as DataType,
                min: item?.min ?? null,
                max: item?.max ?? null,
                isRangeFilter: Boolean(attributeFilter?.isRangeFilter),
                filterTitle: attributeFilter?.name ?? '',
              }),
            ) ?? [],
        }),
      ) ?? []
    )
  }

  const filterItems = useMemo(
    () => (filterData ? [...handleGeneralFilters(), ...handleExclusiveFilters()] : []),
    [filterData],
  )

  const categoriesFilter = useMemo(
    () => filterItems.filter((item) => item.name === 'categories')?.[0],
    [filterItems],
  )

  return {
    filterItems,
    categoriesFilter,
  }
}
