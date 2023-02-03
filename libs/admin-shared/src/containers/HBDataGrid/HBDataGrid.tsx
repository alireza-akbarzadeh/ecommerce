import instance from '@hasty-bazar/admin-shared/core/handler'
import phrasesMessages from '@hasty-bazar/admin-shared/core/translations/phrases.messages'
import { getFilter } from '@hasty-bazar/admin-shared/utils'
import { HBAgGrid, HBAgGridProps } from '@hasty-bazar/core'
import {
  ColDef,
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  RowDoubleClickedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRouter } from 'next/router'
import React, { ForwardedRef, forwardRef, useCallback, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
export interface HBDataGridProps extends HBAgGridProps {
  actionUrl: string
  editUrl?: string
  loadingLabel?: string
  onSelectedChanged?: (selected: any[]) => void
  onPageSizeChange?: (pageSize: number) => void
  onPageChange?: (page: number) => void
  onDoubleClick?: (rowData: RowDoubleClickedEvent) => void
  onDataChange?: (data: any) => void
}

const HBGrid = forwardRef(
  <T extends AgGridReact>(
    {
      actionUrl,
      editUrl,
      defaultColDef,
      paginationPageSize = 1000,
      loadingLabel,
      onSelectedChanged,
      onDoubleClick,
      onDataChange,
      ...props
    }: HBDataGridProps,
    ref: ForwardedRef<T>,
  ) => {
    const { formatMessage } = useIntl()
    loadingLabel = loadingLabel || formatMessage(phrasesMessages.loading)
    const [totalRows, setTotalRows] = useState<number>()
    const router = useRouter()

    const getServerSideDatasource: (server: any) => IServerSideDatasource = (server: any) => {
      return {
        getRows: (params: IServerSideGetRowsParams) => {
          const queries = getFilter(params.request, paginationPageSize)
          const midd = queries ? (actionUrl.includes('?') ? '&' : '/?') : ''
          instance
            .get(`${actionUrl}${midd}${queries}`)
            .then((res) => {
              const data = res.data.data
              setTotalRows(data.totalItems)
              onDataChange?.(data)

              params.success({
                rowData: data.items.map((item: any) => {
                  return {
                    ...item,
                    _actions: item?.id?.toString(),
                  }
                }),
                rowCount: data.totalItems,
              })
            })
            .catch((err) => {
              params.fail()
            })
        },
      }
    }

    const onGridReady = useCallback((params: GridReadyEvent) => {
      const dataSource = getServerSideDatasource(params)
      params.api!.setServerSideDatasource(dataSource)
    }, [])

    const defaultColDefInner = useMemo<ColDef>(() => {
      return {
        filter: true,
        flex: 1,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      }
    }, [])

    const handleSelectionChanged = useCallback((event: SelectionChangedEvent) => {
      const selectedRows = event.api.getSelectedRows()
      onSelectedChanged?.(selectedRows)
    }, [])

    return (
      <HBAgGrid
        onGridReady={onGridReady}
        onRowDoubleClicked={(event) => {
          if (editUrl) {
            router.push(editUrl + event?.data?.id)
          }
          onDoubleClick?.(event)
        }}
        totalRows={totalRows}
        {...props}
        ref={ref}
        paginationPageSize={paginationPageSize}
        defaultColDef={{ ...defaultColDefInner, ...defaultColDef }}
        onSelectionChanged={handleSelectionChanged}
        overlayLoadingTemplate={`<span class="ag-overlay-loading-center">${loadingLabel}</span>`}
      />
    )
  },
)

export default HBGrid
