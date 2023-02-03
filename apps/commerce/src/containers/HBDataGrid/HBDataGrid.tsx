import { getFilter } from '@hasty-bazar-commerce/utils'
import { HBAgGrid, HBAgGridProps } from '@hasty-bazar/core'
import {
  ColDef,
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  SelectionChangedEvent,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { ForwardedRef, forwardRef, useCallback, useMemo, useState } from 'react'
export interface HBDataGridProps extends HBAgGridProps {
  actionUrl: string
  onSelectedChanged?: (selected: any[]) => void
  loadingLabel?: string
}

const HBGrid = forwardRef(
  <T extends AgGridReact>(
    {
      actionUrl,
      defaultColDef,
      paginationPageSize = 50,
      onSelectedChanged,
      loadingLabel = 'درحال پردازش ...',
      ...props
    }: HBDataGridProps,
    ref: ForwardedRef<T>,
  ) => {
    const [totalRows, setTotalRows] = useState<number>()

    const getServerSideDatasource: (server: any) => IServerSideDatasource = (server: any) => {
      return {
        getRows: (params: IServerSideGetRowsParams) => {
          const queries = getFilter(params.request, paginationPageSize)

          const midd = actionUrl.includes('?') ? '&' : '/?'

          fetch(`${actionUrl}${midd}${queries}`)
            .then((httpResponse) => httpResponse.json())
            .then((response) => {
              setTotalRows(response.data.totalItems)

              params.success({
                rowData: response.data.items.map((item: any) => {
                  return {
                    ...item,
                    _actions: item.id.toString(),
                  }
                }),
                rowCount: response.data.totalItems,
              })
            })
            .catch((error) => {
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
      onSelectedChanged && onSelectedChanged(selectedRows)
    }, [])

    return (
      <HBAgGrid
        onGridReady={onGridReady}
        {...props}
        ref={ref}
        totalRows={totalRows}
        paginationPageSize={paginationPageSize}
        // defaultColDef={{ ...defaultColDefInner, ...defaultColDef }}
        onSelectionChanged={handleSelectionChanged}
        overlayLoadingTemplate={`<span class="ag-overlay-loading-center">${loadingLabel}</span>`}
      />
    )
  },
)

export default HBGrid
