import {
  GridReadyType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { GetMessageQueryResult } from '@hasty-bazar/admin-shared/services/notificationApi.generated'
import { HBAgGridClasses } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { FC, useRef, useState } from 'react'
import { PageOptionType } from '../../Messages'
import { UserMessagesList } from '../../types'
import CreateGridToolbar from './components/CreateGridToolbar'
import useUserCompaniesGrid from './useUsersList'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 440,
  },
}

type UserMessageGridProps = {
  messages: GetMessageQueryResult[]
  total?: number
  partyId?: string
  onChangePageOption: (pageOption: PageOptionType) => void
}

const UserMessageGrid: FC<UserMessageGridProps> = ({
  messages = [],
  total = 0,
  partyId,
  onChangePageOption,
}) => {
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<UserMessagesList[]>([])

  const refreshGridData = (isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current?.api.deselectAll()
  }

  const handleChangedSelectedRows = (selectedRows: UserMessagesList[]) => {
    setSelectedRows(selectedRows)
  }

  const { columnDefs, autoGroupColumnDef } = useUserCompaniesGrid({
    gridRef,
    partyId,
  })

  const onGridReady = (params: GridReadyType) => {
    onChangePageOption({
      page: params.PageNumber,
      pageSize: params.PageSize,
    })
  }

  return (
    <Box
      sx={{
        height: 540,
      }}
    >
      <HBDataGridClient
        classes={classes}
        actionUrl={''}
        rowData={messages}
        totalRows={total}
        rightHeader={<></>}
        pagination
        paginationPageSize={10}
        rowSelection="multiple"
        enableRtl
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        serverSideSortingAlwaysResets
        serverSideFilteringAlwaysResets
        onGridReady={onGridReady}
        ref={gridRef}
        GridToolbar={(props) => (
          <CreateGridToolbar<UserMessagesList>
            selectedRows={selectedRows}
            handleSetDeleteDialogState={() => {}}
            onGridActionsChange={() => {}}
            onRefreshClick={() => refreshGridData(true)}
            gridRef={gridRef}
            toolbarOptions={{
              editProps: { show: false },
              deleteProps: { show: false },
              statusProps: { show: false },
              moreProps: { show: false },
              searchProps: { show: false },
              addProps: { show: false },
              refreshProps: { show: false },
            }}
            {...props}
          />
        )}
        {...{ columnDefs }}
      />
    </Box>
  )
}

export default UserMessageGrid
