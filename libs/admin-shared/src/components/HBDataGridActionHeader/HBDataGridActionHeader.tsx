import { Box, Checkbox } from '@mui/material'
import { IHeaderParams } from 'ag-grid-community'
import React, { useMemo } from 'react'

export default function HBDataGridActionHeader(props: IHeaderParams) {
  const handleChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      props.api.forEachNode((node) => {
        node.setSelected(true)
      })
    } else {
      props.api.deselectAll()
    }
  }

  const handleCheckIsSelectAll = useMemo(() => {
    const { api } = props
    const pageSize = api.paginationGetPageSize()
    const currentPage = api.paginationGetCurrentPage() + 1
    const totalRows = api.getDisplayedRowCount()

    const start = currentPage * pageSize - (pageSize - 1)
    const end = Math.min(start + pageSize - 1, totalRows)
    const totalRowInPage = end - start + 1

    if (api.getSelectedRows().length === 0) return undefined
    return api.getSelectedRows().length !== totalRowInPage
  }, [props])

  return (
    <Box
      sx={{
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <Checkbox
        indeterminate={handleCheckIsSelectAll}
        defaultChecked={!handleCheckIsSelectAll && props.api.getSelectedRows().length > 0}
        onChange={handleChangeCheckBox}
      />
    </Box>
  )
}
