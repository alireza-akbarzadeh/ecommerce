import { Box, SelectChangeEvent, SxProps, Theme, useTheme } from '@mui/material'
import { SideBarDef, ToolPanelDef } from 'ag-grid-community'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-enterprise'
import { AgGridReact, AgGridReactProps } from 'ag-grid-react'
import React, { FC, ForwardedRef, forwardRef, useMemo, useRef } from 'react'
import useCombinedRefs from '../../hooks/useCombinedRefs'
import { MenuItemProps } from '../HBGridHeader'
import { HBDataGridToolbarProps } from '../HBGrigToolbar'
import HBGridToolbar from '../HBGrigToolbar/HBGrigToolbar'
import AgGridCustomLoading from './AgGridCustomLoading'
import { gridClasses, gridWrapper, HBAgGridClasses, HBAgGridRootStyle } from './HBAgGrid.styles'
import Pagination, { AgGridPaginationOptions } from './HBAgGridPagination'
import { AG_GRID_LOCALE_FA } from './locales/fa'

export interface HBAgGridProps extends Omit<AgGridReactProps, 'ref'> {
  classes?: HBAgGridClasses
  rightHeader?: React.ReactNode
  toolbarActions?: MenuItemProps[]
  Search?: React.ReactNode
  searchChange?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  totalRowsLabel?: string
  totalRows?: number
  paginationPageNumber?: number
  onPageSizeChange?: (pageSize: number) => void
  sx?: SxProps<Theme>
  GridToolbar?: FC<HBDataGridToolbarProps>
  noToolbar?: boolean
  paginationOptions?: AgGridPaginationOptions
  onPageChange?: (pageNumber: number) => void
  searchText?: string
}

const HBAgGrid = forwardRef(
  <T extends AgGridReact>(
    {
      enableRtl,
      defaultColDef = {},
      animateRows = true,
      localeText,
      sideBar,
      icons,
      rightHeader,
      classes,
      totalRowsLabel,
      toolbarActions,
      Search,
      searchChange,
      totalRows,
      onPageSizeChange,
      GridToolbar = HBGridToolbar,
      noToolbar,
      paginationOptions,
      onPageChange,
      searchText,
      ...props
    }: HBAgGridProps,
    ref: ForwardedRef<T>,
  ) => {
    const theme = useTheme()

    const gridRef = useRef<AgGridReact>(null)
    const combinedRef = useCombinedRefs<AgGridReact>(ref, gridRef)

    const defaultColDefNew = useMemo(
      () => ({
        resizable: true,
        sortable: true,
        minWidth: 100,
        filterParams: {
          debounceMs: 1000,
          suppressAndOrCondition: true,
        },
        ...defaultColDef,
      }),
      [],
    )

    const customSideBar = useMemo<SideBarDef | string | string[] | boolean | null>(() => {
      const toolPanels: (string | ToolPanelDef)[] = []
      const attr: { [key: string]: ToolPanelDef } = {
        columns: {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            suppressRowGroups: true,
            suppressPivots: true,
            suppressValues: true,
            suppressPivotMode: true,
          },
        },
        filters: {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
        },
      }
      if (Array.isArray(sideBar)) {
        sideBar.forEach((element: string) => {
          toolPanels.push(attr[element])
        })
      } else if (typeof sideBar === 'boolean' && sideBar) {
        toolPanels.push(attr['columns'])
        toolPanels.push(attr['filters'])
      } else if (typeof sideBar === 'string') {
        toolPanels.push(attr[sideBar])
      } else {
        return { ...sideBar }
      }

      return {
        toolPanels,
        defaultToolPanel: '',
      }
    }, [])

    const customIcons = useMemo<{
      filter: string
      columnMoveMove: string
    }>(() => {
      return {
        filter: '<i class="uil uil-filter" />',
        columnMoveMove: '<i class="uil uil-direction" />',
      }
    }, [])

    const handleChangePage = (_: React.ChangeEvent<unknown>, page: number) => {
      combinedRef.current!.api.paginationGoToPage(page - 1)
      onPageChange?.(page)
    }

    const handleChangePageSize = (event: SelectChangeEvent<unknown>) => {
      const { value } = event.target
      combinedRef.current!.api.paginationGoToPage(0)
      combinedRef.current!.api.paginationSetPageSize(Number(value))
      onPageSizeChange?.(Number(value))
    }

    return (
      <Box className="ag-theme-alpine" sx={{ ...gridWrapper, ...classes?.wrapper }}>
        {!noToolbar && (
          <Box sx={gridClasses.gridHeaderWrapper}>
            <Box sx={{ ...gridClasses.gridHeader }}>
              <GridToolbar searchText={searchText} agGridRef={gridRef} />
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block', md: 'block' } }}>{rightHeader}</Box>
          </Box>
        )}
        <HBAgGridRootStyle
          defaultColDef={defaultColDefNew}
          ref={combinedRef}
          enableRtl={enableRtl || theme.direction === 'rtl'}
          localeText={{ ...AG_GRID_LOCALE_FA, ...localeText }}
          animateRows={animateRows}
          loadingCellRenderer={AgGridCustomLoading}
          blockLoadDebounceMillis={300}
          icons={{ ...customIcons, ...icons }}
          suppressPaginationPanel
          suppressScrollOnNewData
          {...(sideBar && { sideBar: customSideBar })}
          {...props}
        />
        {props.pagination && (
          <Pagination
            totalRows={totalRows || 0}
            pageSize={props.paginationPageSize || 0}
            pageNumber={props.paginationPageNumber}
            onChangeClient={handleChangePage}
            onChangePageSizeClient={handleChangePageSize}
            totalRowsLabel={totalRowsLabel}
            gridRef={combinedRef}
            options={paginationOptions}
          />
        )}
      </Box>
    )
  },
)

HBAgGrid.displayName = 'HBAgGrid'
HBAgGrid.defaultProps = {}

export default HBAgGrid
