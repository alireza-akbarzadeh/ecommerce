import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { HBAgGridClasses, HBDataGrigToolbar } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { FC, useRef } from 'react'
import useBulletinRequestsGrid from '../hooks/useBulletinRequestsGrid'

type BulletinRequestsGridProps = {
  actionUrl?: string
}

export const classes: HBAgGridClasses = {
  wrapper: {
    height: 580,
  },
}

const BulletinRequestsGrid: FC<BulletinRequestsGridProps> = ({ actionUrl = '' }) => {
  const gridRef = useRef<HBDataGridClientRef>(null)
  const { columnDefs } = useBulletinRequestsGrid({ gridRef })

  const handleChangedGridActions = (value: number | string, type: 'search') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'EmailAddress', operator: 'contains', value: String(value) },
          { field: 'NewsLetterEnumTitle', operator: 'contains', value: String(value) },
          { field: 'PartyFullName', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchBulletinRequests',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchBulletinRequests')
      }
    }
  }

  const refreshGridData = (isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current?.api?.deselectAll()
  }

  return (
    <Box sx={{ height: 700 }}>
      <HBDataGridClient
        actionUrl={actionUrl}
        pagination
        paginationPageSize={10}
        enableRtl
        sideBar
        ref={gridRef}
        classes={classes}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            searchProps={{ show: false }}
            moreProps={{ show: true }}
            refreshProps={{ onClick: refreshGridData }}
            addProps={{ show: false }}
            editProps={{ show: false }}
            deleteProps={{ show: false }}
            statusProps={{ show: false }}
            {...props}
          />
        )}
        {...{ columnDefs }}
      />
    </Box>
  )
}
export default BulletinRequestsGrid
