import phrasesMessages from '@hasty-bazar/admin-shared/core/translations/phrases.messages'
import { HBAgGrid, HBAgGridProps } from '@hasty-bazar/core'
import {
  ColumnEverythingChangedEvent,
  RowDoubleClickedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRouter } from 'next/router'
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import useDataGrid, { DownloadType } from './useDataGrid'
import useOnGridReady from './useOnGridReady'

export type GridFilterFieldType = {
  field: string
  operator: 'equal' | 'contains'
  value: string | number | boolean | null
}

export type GridFilterType = {
  id: string
  fields: GridFilterFieldType[]
  addToFilter?: boolean
  type: 'filter' | 'search'
}

export type GridReadyType = {
  PageNumber: number
  PageSize: number
  Ordering: string
  Filter: string
}

//test

const gridSx = {
  '& .ag-cell-wrapper': {
    flexDirection: 'row !important',
    gap: 0,
  },
  '& .ag-rtl .ag-row-group-leaf-indent': {
    marginLeft: '0px !important',
  },
  '& .ag-cell-wrapper.ag-row-group': {
    paddingLeft: '0px !important',
    paddingRight: '0px !important',
  },
}

export interface HBDataGridClientProps extends Omit<HBAgGridProps, 'onGridReady'> {
  actionUrl: string
  editUrl?: string
  loadingLabel?: string
  onSelectedChanged?: (selected: any[]) => void
  onPageSizeChange?: (pageSize: number) => void
  onPageChange?: (page: number) => void
  onDoubleClick?: (rowData: RowDoubleClickedEvent) => void
  onDataChange?: (data: any) => void
  onGridReady?: (params: GridReadyType) => void
  id?: string
}

export interface HBDataGridClientRef extends AgGridReact {
  refreshGridData: (isClearSearch?: boolean) => void
  searchGridData: (search: string, fieldNames: string, withFilter?: boolean) => void
  downloadGridData: ({ downloadFileMethod, downloadAll }: DownloadType) => void
  addFilter: (filter: GridFilterType) => void
  removeFilter: (id: string) => void
  getFilters: () => GridFilterType[]
}

const HBDataGridClient = forwardRef(
  <T extends HBDataGridClientRef>(
    {
      actionUrl,
      editUrl,
      defaultColDef,
      paginationPageSize = 50,
      loadingLabel,
      onSelectedChanged,
      onDoubleClick,
      onDataChange,
      id,
      ...props
    }: HBDataGridClientProps,
    ref: ForwardedRef<T>,
  ) => {
    const innerRef = useRef<AgGridReact | null>(null)
    const router = useRouter()
    const { formatMessage } = useIntl()
    loadingLabel = loadingLabel || formatMessage(phrasesMessages.loading)
    const [isOnGridReady, setIsOnGridReady] = useState(false)

    const { defaultColDefInner, downloadGrid, decryptData, encryptData } = useDataGrid({
      gridRef: innerRef,
    })

    const {
      filterAction,
      onGridReady,
      setGridFilter,
      customPageSize,
      gridFilter,
      pageNumber,
      rowsData,
      search,
      setFilterAction,
      setPageNumber,
      setCustomPageSize,
      setSearch,
      totalRows,
    } = useOnGridReady({
      innerRef,
      actionUrl,
      gridReady: props.onGridReady,
      id,
      onDataChange,
      paginationPageSize,
    })

    const handleSelectionChanged = (event: SelectionChangedEvent) => {
      const selectedRows = event.api?.getSelectedRows()
      onSelectedChanged?.(selectedRows)
    }

    useEffect(() => {
      if (innerRef.current && filterAction) {
        onGridReady(null)
      }
    }, [filterAction])

    useEffect(() => {
      if (innerRef.current && actionUrl && isOnGridReady) {
        setFilterAction('refreshGridData' + Math.random())
      }
    }, [actionUrl])

    useImperativeHandle(
      ref,
      () =>
        ({
          ...innerRef?.current,
          refreshGridData: (isClearSearch?: boolean) => {
            setGridFilter([])
            if (isClearSearch) {
              setSearch('')
            }
            innerRef?.current?.api?.setQuickFilter('')
            innerRef?.current?.api?.setFilterModel(null)
            innerRef?.current?.columnApi?.applyColumnState({
              state: [],
              defaultState: { sort: null },
            })

            setPageNumber(1)
            setFilterAction('refreshGridData' + Math.random())
          },
          downloadGridData: ({ downloadFileMethod, downloadAll: isAll }: DownloadType) => {
            const downloadAll = typeof isAll === 'boolean' ? isAll : false
            downloadGrid({ downloadFileMethod, downloadAll, pageNumber })
          },
          addFilter: (filter: GridFilterType) => {
            const filterIndex = gridFilter.findIndex((item) => item.id === filter.id)
            const newGridFilter = [...gridFilter]
            if (filterIndex > -1) {
              newGridFilter[filterIndex] = filter
            } else {
              newGridFilter.push(filter)
            }
            setGridFilter(newGridFilter)
            setPageNumber(1)
            setFilterAction('addFilter' + JSON.stringify(filter))
          },
          removeFilter: (id: string) => {
            setGridFilter((prev) => prev.filter((item) => item.id !== id))
            setPageNumber(1)
            setFilterAction('removeFilter')
          },
          getFilters: () => gridFilter,
        } as T),
    )

    const columnChange = (event: ColumnEverythingChangedEvent) => {
      if (id) {
        const pageUrl = new URL(window.location.href)
        const columnState = event.columnApi.getColumnState()
        const sessionKey = `grid_${id}_${pageUrl.pathname}`
        const sessionData = localStorage.getItem(sessionKey)

        if (sessionData) {
          const gridOptions = decryptData(sessionData)
          gridOptions.columnState = columnState
          localStorage.setItem(sessionKey, encryptData(gridOptions))
        } else {
          const gridOptions = {
            columnState,
            filterModel: innerRef.current?.api?.getFilterModel() || null,
            search: null,
          }
          localStorage.setItem(sessionKey, encryptData(gridOptions))
        }
      }
    }

    return (
      <HBAgGrid
        ref={innerRef}
        rowData={rowsData}
        onRowDoubleClicked={(event) => {
          if (editUrl && event?.data?.id) {
            router.push(editUrl + event?.data?.id)
          }
          onDoubleClick?.(event)
        }}
        totalRows={totalRows}
        animateRows={false}
        {...props}
        paginationPageNumber={pageNumber}
        rowModelType="clientSide"
        onGridReady={(args) => {
          onGridReady(args)
          setIsOnGridReady(true)
        }}
        onFilterChanged={onGridReady}
        onSortChanged={onGridReady}
        onPageChange={(page) => {
          onGridReady(page, 'pageChange')
          props.onPageChange?.(page)
        }}
        onColumnVisible={columnChange}
        onColumnPinned={columnChange}
        onColumnMoved={columnChange}
        onPageSizeChange={(pageSize) => onGridReady(pageSize, 'pageSizeChange')}
        onColumnRowGroupChanged={(e) => onGridReady(e, 'rowGroupingChange')}
        paginationPageSize={customPageSize}
        defaultColDef={{ ...defaultColDefInner, ...defaultColDef }}
        onSelectionChanged={handleSelectionChanged}
        overlayLoadingTemplate={`<span class="ag-overlay-loading-center">${loadingLabel}</span>`}
        searchText={search}
        sx={{
          ...props?.sx,
          ...gridSx,
        }}
      />
    )
  },
)

export default HBDataGridClient
