import { Box, SelectChangeEvent, SxProps, Theme, Typography } from '@mui/material'
import { AgGridReact } from 'ag-grid-react'
import React, { useEffect, useState } from 'react'
import { HBPagination } from '../HBPagination'
import { HBSelect } from '../HBSelect'
import { gridClasses } from './HBAgGrid.styles'

export type AgGridPaginationOptions = {
  hideGoto?: boolean
  hideselectPage?: boolean
}

export type AgGridPaginationProps = {
  totalRows: number
  pageSize: number
  pageNumber?: number
  onChange?: (page: number) => void
  onChangePageSize?: (pageSize: number) => void
  onChangeClient?: (event: React.ChangeEvent<unknown>, page: number) => void
  onChangePageSizeClient?: (event: SelectChangeEvent<unknown>, child: React.ReactNode) => void
  totalRowsLabel?: string
  gridRef?: React.RefObject<AgGridReact>
  options?: AgGridPaginationOptions
  wrapperSx?: SxProps<Theme>
}

const Pagination = ({
  totalRows,
  pageSize,
  pageNumber,
  onChange,
  onChangePageSize,
  onChangeClient,
  onChangePageSizeClient,
  totalRowsLabel,
  gridRef,
  options = { hideselectPage: false, hideGoto: false },
  wrapperSx = {},
}: AgGridPaginationProps) => {
  const [totalPage, setTotalPage] = useState<number>()
  const [currentPage, setCurrentPage] = useState<number>(pageNumber || 1)
  const [pageSize1, setPageSize1] = useState<number>(pageSize)

  const start = currentPage * pageSize1 - (pageSize1 - 1)
  const end = Math.min(start + pageSize1 - 1, totalRows)

  useEffect(() => {
    const numberOfPages = Math.floor((totalRows + pageSize1 - 1) / pageSize1)
    setTotalPage(numberOfPages)
  }, [totalRows, pageSize1])

  const handleChangePage = (event: React.ChangeEvent<unknown>, page: number): void => {
    setCurrentPage(page)
    onChange?.(page)
    onChangeClient?.(event, page)
  }

  const handleChangePageSize = (
    event: SelectChangeEvent<unknown>,
    child: React.ReactNode,
  ): void => {
    onChangePageSize?.(Number(event.target.value))
    onChangePageSizeClient?.(event, child)
    setPageSize1(Number(event.target.value))
  }

  const handleGotoPage = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    onChange?.(pageNumber)
    const event: any = {}
    onChangeClient?.(event, pageNumber)

    gridRef?.current?.api.paginationGoToPage(pageNumber - 1)
  }
  useEffect(() => {
    if (pageSize) {
      setPageSize1(pageSize)
    }
  }, [pageSize])
  const wrapperStyle = { ...(gridClasses.gridPaginationWrapper || {}), ...wrapperSx }
  return (
    <Box

    // sx={{ visibility: totalRows > 0 ? 'visible' : 'hidden' }}
    >
      <Box sx={gridClasses.gridPaginationWrapper} id="gridPaginationWrapper">
        <HBPagination
          count={totalPage}
          page={pageNumber || currentPage}
          onChange={handleChangePage}
          gotoPage={!options.hideGoto ? handleGotoPage : undefined}
        />
        {!options.hideselectPage && (
          <Box sx={gridClasses.gridPaginationLabel}>
            <HBSelect
              sx={{ mr: 1, height: 30, minWidth: 107 }}
              label={totalRowsLabel || ''}
              size="small"
              onChange={handleChangePageSize}
              value={pageSize1}
              menuItem={[
                { title: '10', value: 10 },
                { title: '25', value: 25 },
                { title: '50', value: 50 },
                { title: '100', value: 100 },
                { title: '500', value: 500 },
                { title: '1000', value: 1000 },
                { title: '100000', value: 100000 },
              ]}
            />
            <Box sx={{ ...gridClasses.gridPaginationTotal }}>
              <Box>
                <Typography variant="subtitle2" component="span">
                  از {totalRows}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" component="span">
                  {end}
                </Typography>{' '}
                -
                <Typography variant="subtitle2" component="span">
                  {start}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Pagination
