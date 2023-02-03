import instance from '@hasty-bazar/admin-shared/core/handler'
import phrasesMessages from '@hasty-bazar/admin-shared/core/translations/phrases.messages'
import { errorsToString } from '@hasty-bazar/admin-shared/utils'
import { getGridOptions } from '@hasty-bazar/admin-shared/utils/downloadUrl'
import { pascalCase, sleep } from '@hasty-bazar/admin-shared/utils/util'
import { openToast } from '@hasty-bazar/core'
import { AgGridReact } from 'ag-grid-react'
import { getSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { GridFilterType, GridReadyType } from './HBDataGridClient'
import useDataGrid from './useDataGrid'

type OnGridReadyType = {
  innerRef: React.RefObject<AgGridReact>
  id?: string
  actionUrl?: string
  paginationPageSize?: number
  gridReady?: (params: GridReadyType) => void
  onDataChange?: (data: any) => void
}

export default function useOnGridReady({
  innerRef,
  id,
  actionUrl = '',
  paginationPageSize,
  gridReady,
  onDataChange,
}: OnGridReadyType) {
  const [pageNumber, setPageNumber] = useState(1)
  const [customPageSize, setCustomPageSize] = useState(paginationPageSize || 25)
  const [search, setSearch] = useState('')
  const [gridFilter, setGridFilter] = useState<GridFilterType[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [rowsData, setRowsData] = useState<any[]>([])
  const [filterAction, setFilterAction] = useState<string | undefined>()

  const { formatMessage } = useIntl()
  const router = useRouter()

  const { gridLoading, encryptData, decryptData } = useDataGrid({
    gridRef: innerRef,
  })

  const onGridReady = useCallback(
    (params: any, type?: any) => {
      const pageUrl = new URL(window.location.href)
      let page: number = pageNumber
      let { filter: filterSystem, filterFields, pageSize, sortFields } = getGridOptions(innerRef)
      pageSize = customPageSize || pageSize

      if (type === 'pageChange') {
        page = params
        setPageNumber(page)
      } else if (type === 'pageSizeChange') {
        pageSize = params
        page = 1
        setCustomPageSize(params)
        setPageNumber(page)
      }
      if (type === 'rowGroupingChange') {
        const rowGroupCols: string[] = params?.columns?.map((item: any) => item?.colId).join(',')
        filterFields['rowGroupCols'] = rowGroupCols
        pageSize = 100000
        setCustomPageSize(pageSize)
        page = 1
        setPageNumber(page)
      }
      if (params?.type === 'filterChanged') {
        page = 1
        setPageNumber(page)
      }

      let sessionSearch: string | null = ''

      if (params?.type === 'gridReady' && id) {
        sessionSearch = localStorage.getItem(`grid_${id}_${pageUrl.pathname}`) || ''
        if (sessionSearch) {
          const gridOption = decryptData(sessionSearch)

          setGridFilter(gridOption?.gridFilter || [])
          setSearch(gridOption?.searchValue || '')

          innerRef.current!.columnApi.applyColumnState({
            state: gridOption?.columnState,
            applyOrder: true,
          })
          if (gridOption?.filterModel) {
            innerRef.current!.api.setFilterModel(gridOption?.filterModel)
          }
          page = gridOption?.pageNumber
          pageSize = gridOption?.pageSize
          setCustomPageSize(pageSize)
          setPageNumber(page)
        }
      }

      let gridUrl: URL | null = null
      try {
        gridUrl = new URL(actionUrl)

        if (sessionSearch && id) {
          const gridOption = decryptData(sessionSearch)
          if (!gridUrl?.search) {
            gridUrl.search = gridOption?.search
          }
        }

        const oldFilter = gridUrl?.searchParams?.get('Filter')

        gridUrl?.searchParams?.set('PageNumber', page.toString())
        gridUrl?.searchParams?.set('PageSize', pageSize.toString())
        sortFields && gridUrl?.searchParams?.set('Ordering', sortFields)
        filterSystem &&
          gridUrl?.searchParams?.set(
            'Filter',
            oldFilter ? `${oldFilter} And ${filterSystem}` : filterSystem,
          )
        filterFields &&
          Object.keys(filterFields).forEach((key) =>
            gridUrl?.searchParams.set(key, filterFields[key]),
          )

        const filterItems: string[] = []
        gridFilter.forEach((filter) => {
          filter.fields.forEach((field) => {
            const itemField = pascalCase(field.field)
            const hasFilter = gridUrl?.searchParams.has(itemField)

            if (!hasFilter) {
              gridUrl?.searchParams?.set(itemField, field.value?.toString() ?? '')
            }
            if (filter.addToFilter && !hasFilter) {
              if (field.operator === 'equal') {
                filterItems.push(`${itemField}_Equal_--${itemField}`)
              } else {
                filterItems.push(`${itemField}.Contains(--${itemField})`)
              }
            }
          })
          if (filter.type === 'search') {
            setSearch(filter.fields[0].value?.toString() ?? '')
          }
        })
        if (filterItems.length > 0) {
          const oldFilter = gridUrl?.searchParams?.get('Filter')
          const newFilter = !oldFilter
            ? filterItems.join(' Or ')
            : `${oldFilter} And (${filterItems.join(' Or ')})`
          gridUrl?.searchParams?.set('Filter', newFilter)
        }
      } catch (e) {
        // console.log(e)
      }

      const options = {
        PageNumber: page,
        PageSize: pageSize,
        Ordering: sortFields,
        Filter: gridUrl?.searchParams?.get('Filter') || filterSystem,
        ...filterFields,
      }

      if (gridReady) {
        return gridReady(options as GridReadyType)
      }

      if (!actionUrl || !gridUrl) {
        gridLoading(false)
        return
      }

      if (!gridUrl.searchParams.get('PageSize')) {
        return
      }

      if (params?.type !== 'gridReady' && id) {
        const gridOptions = {
          columnState: innerRef.current!.columnApi.getColumnState(),
          filterModel: innerRef.current?.api?.getFilterModel() || null,
          search: gridUrl?.search || null,
          gridFilter,
          searchValue: gridFilter.find((item) => item.type === 'search')?.fields[0].value,
          pageNumber: page,
          pageSize,
        }

        localStorage.setItem(`grid_${id}_${pageUrl.pathname}`, encryptData(gridOptions))
      }

      gridLoading(true)
      instance
        .get(gridUrl.toString())
        .then((res) => {
          const data = res.data.data
          setTotalRows(data.totalItems)
          onDataChange?.(data)

          const rowData = data.items.map((item: any) => {
            return {
              ...item,
              _actions: item?.id?.toString(),
            }
          })

          setRowsData(rowData || [])
        })
        .catch(async (err) => {
          openToast({
            message:
              err?.request?.status === 401
                ? formatMessage(phrasesMessages.notAuthorized)
                : errorsToString(err),
            type: 'error',
          })

          if (err?.request?.status === 401) {
            const session = await getSession()

            localStorage.setItem('error_401', JSON.stringify(err?.response?.data || {}))
            localStorage.setItem('error-401-token', JSON.stringify(session?.accessToken || ''))

            signOut({ redirect: false }).then(() => {
              router.replace('/auth/signin/')
            })
          }
        })
        .finally(() => {
          gridLoading(false)
        })
    },
    [gridFilter, customPageSize, pageNumber, search, actionUrl],
  )

  return {
    onGridReady,
    rowsData,
    totalRows,
    search,
    gridFilter,
    setGridFilter,
    pageNumber,
    customPageSize,
    setPageNumber,
    setCustomPageSize,
    setSearch,
    filterAction,
    setFilterAction,
  }
}
