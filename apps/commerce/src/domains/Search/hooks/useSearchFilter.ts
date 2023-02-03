import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebCatalogSaveSearchQuery } from '@hasty-bazar-commerce/services/catalogApi.generated'
import {
  FacetsApiResult,
  ProductFacet,
  ProductFilter,
  SortOrderType,
  usePostWebGeneralDataCollectionProductsFacetsMutation,
} from '@hasty-bazar-commerce/services/generalDataApi.generated'
import useScrollDirection, { ScrollDirection } from 'libs/core/src/hooks/useScrollDirection'
import { useRouter } from 'next/router'
import { parseUrl } from 'query-string'
import { useEffect, useMemo, useRef, useState } from 'react'
import { IFilterParams } from '../searchFilterModels'
import { useClearFilter } from './useClearFilter'
import { useFilterItems } from './useFilterItems'
import { useFilterQuery } from './useFilterQuery'
import { useFilterSortPagination } from './useFilterSortPagination'
import { useMemoWithCompare } from './useMemoWithCompare'
import { useSaveQuery } from './useSaveQuery'
import { useSearchFilterResult } from './useSearchFilterResult'
import { useSelectedFilter } from './useSelectedFilter'
import { useSubmitFilter } from './useSubmitFilter'

export const useSearchFilter = () => {
  const scrollDirection = useScrollDirection(0)
  const router = useRouter()

  const params: IFilterParams = parseUrl(decodeURIComponent(router.asPath), {
    arrayFormat: 'index',
  }).query as any
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 12
  const [filterData, setFilterData] = useState<FacetsApiResult>()
  const [productResultData, setProductResultData] = useState<ProductFacet[]>([])
  const [isNotFirstFilterRequest, setIsNotFirstFilterRequest] = useState(false)
  const [isNotFirstProductsRequest, setIsNotFirstProductsRequest] = useState(false)
  const [isVendorFirstRender, setIsVendorFirstRender] = useState(false)
  const [paginationMode, setPaginationMode] = useState<'infinite' | 'pagination'>('infinite')
  const totalResult = useRef(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const collectionId = params.collectionId
  const search = params.query?.replace?.(/['"]+/g, '')
  const sortBy = params.sortBy
  const path = collectionId
    ? `/collection/?collectionId=${collectionId}&`
    : router.asPath.startsWith('/vendor') && search
    ? `/vendor/?query=${search}&`
    : router.asPath.startsWith('/vendor')
    ? `/vendor/?`
    : router.asPath.startsWith('/collection')
    ? `/collection/?`
    : `/search/?query=${search}&`
  const isCollection = router.asPath.startsWith('/collection')

  const { data: savedQueryData, refetch: refetchSavedQuery } = useGetWebCatalogSaveSearchQuery({
    ...ApiConstants,
    filter: '',
  })
  const [postProductsFilters, { isLoading: filterLoading }] =
    usePostWebGeneralDataCollectionProductsFacetsMutation()
  const { handleMakeQuery } = useFilterQuery(router, path)
  const { selectedFilters } = useSelectedFilter(router, params, setPage, setPaginationMode)

  const getFilterData = (filter?: ProductFilter) => {
    postProductsFilters({
      ...ApiConstants,
      productFacetsArgumentsFilterModel: {
        id: collectionId,
        pageNumber: 1,
        pageSize: PAGE_SIZE,
        productFilter: filter ?? selectedFilters,
        sortOrderType: +sortBy === 0 ? undefined : (+sortBy as SortOrderType),
        facets: 1201, // get only filter
        searchQuery: isCollection ? null : search,
      },
    }).then((res: any) => res?.data && setFilterData(res.data))
  }

  const selectedFiltersMemo = useMemoWithCompare<ProductFilter>(selectedFilters)

  //get filters
  useEffect(() => {
    if (isNotFirstFilterRequest) {
      getFilterData()
    } else setIsNotFirstFilterRequest(true)
  }, [collectionId, isNotFirstFilterRequest, search, selectedFiltersMemo?.baseFilter?.categories])

  const getProducts = (
    pageNumber: number,
    filter: ProductFilter,
    sort: SortOrderType | undefined,
    pagination: 'infinite' | 'pagination',
  ) => {
    if (
      containerRef?.current?.offsetTop &&
      // no scroll in infinite scroll mode & scroll after apply/reset filter & sorting
      (pagination === 'pagination' || pageNumber === 1) &&
      // in vendor page don't scroll in first time
      ((isVendor && isVendorFirstRender) || !isVendor)
    ) {
      setTimeout(
        () =>
          window.scrollTo({
            top:
              containerRef?.current?.offsetTop! -
              (scrollDirection === ScrollDirection.up ? 270 : 220),
            behavior: 'smooth',
          }),
        100,
      )
    } else {
      setIsVendorFirstRender(true)
    }
    postProductsFilters({
      ...ApiConstants,
      productFacetsArgumentsFilterModel: {
        id: collectionId,
        pageNumber,
        pageSize: PAGE_SIZE,
        productFilter: filter ?? selectedFilters,
        sortOrderType: !sort || +sort === 0 ? undefined : sort,
        facets: 1202, // get only result
        searchQuery: isCollection ? null : search,
      },
    }).then((res: any) => {
      totalResult.current = res?.data?.data?.totalItems
      if (pagination === 'infinite' && pageNumber > 1)
        setProductResultData((pre) => [...pre, ...(res?.data?.data?.products ?? [])])
      else setProductResultData(res?.data?.data?.products ?? [])
    })
  }

  const { resetFilter, clearFilterGroup } = useClearFilter(
    selectedFilters,
    router,
    path,
    setPage,
    setPaginationMode,
    getProducts,
    sortBy,
    handleMakeQuery,
  )

  useEffect(() => {
    if (isNotFirstProductsRequest) {
      getProducts(1, selectedFilters, +sortBy as SortOrderType, 'infinite')
      setPage(1)
      setPaginationMode('infinite')
    } else setIsNotFirstProductsRequest(true)
  }, [isNotFirstProductsRequest, search, selectedFiltersMemo?.baseFilter?.categories])

  const { handleModifyQuery, saveSearchQueryLoading, deleteSearchQueryLoading } = useSaveQuery(
    refetchSavedQuery,
    router,
    search,
  )
  const { resultData } = useSearchFilterResult(productResultData, collectionId)
  const { handleSorting, handlePagination, sortingItems } = useFilterSortPagination(
    setPage,
    getProducts,
    selectedFilters,
    setPaginationMode,
    sortBy,
    handleMakeQuery,
  )
  const { handleSubmitFilters } = useSubmitFilter(
    selectedFilters,
    getFilterData,
    setPage,
    setPaginationMode,
    handleMakeQuery,
    getProducts,
    sortBy,
  )
  const isVendor = useMemo(() => router.asPath.startsWith('/vendor'), [router])
  const { categoriesFilter, filterItems } = useFilterItems(filterData)

  return {
    resultData,
    filterItems,
    resetFilter,
    handleSubmitFilters,
    drawerOpen,
    handlePagination,
    PAGE_SIZE,
    handleModifyQuery,
    handleSorting,
    setDrawerOpen,
    page,
    isVendor,
    sortingItems,
    filterLoading,
    sortDrawerOpen,
    setSortDrawerOpen,
    sortBy,
    categoriesFilter,
    savedQueryData,
    modifyQueryLoading: saveSearchQueryLoading || deleteSearchQueryLoading,
    selectedFilters,
    totalResult: totalResult.current,
    params,
    setPaginationMode,
    paginationMode,
    containerRef,
    clearFilterGroup,
  }
}
