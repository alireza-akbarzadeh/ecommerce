import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { HBAgGridClasses } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { FC, useRef, useState } from 'react'
import CreateGridToolbar from '../../components/CreateGridToolbar'
import { CrmGridModel } from '../../types'
import { FileViewModal } from './containers/FileViewModal'
import useCrmGrid from './useCrmGrid'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 500,
  },
}

export type CrmGridProps = {
  actionUrl?: string
}

type FileViewType = {
  open: boolean
  crmItem?: CrmGridModel
}

const CrmGrid: FC<CrmGridProps> = ({ actionUrl = '' }) => {
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<CrmGridModel[]>([])
  const [showFileViewModal, setShowFileViewModal] = useState<FileViewType>()

  const refreshGridData = (isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current?.api.deselectAll()
  }

  const handleChangedSelectedRows = (selectedRows: CrmGridModel[]) => {
    setSelectedRows(selectedRows)
  }

  const showFileView = (row: CrmGridModel) => {
    setShowFileViewModal({ open: true, crmItem: row })
  }
  const showOrderView = (row: CrmGridModel) => {}

  const { columnDefs, autoGroupColumnDef } = useCrmGrid({
    gridRef,
    selectedRows,
    showFileView,
    showOrderView,
  })

  return (
    <Box>
      <HBDataGridClient
        classes={classes}
        actionUrl={actionUrl}
        rightHeader={<></>}
        pagination
        paginationPageSize={10}
        rowSelection="multiple"
        enableRtl
        sideBar
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        serverSideSortingAlwaysResets
        serverSideFilteringAlwaysResets
        ref={gridRef}
        GridToolbar={(props) => (
          <CreateGridToolbar<CrmGridModel>
            selectedRows={selectedRows}
            handleSetDeleteDialogState={() => {}}
            onGridActionsChange={() => {}}
            onRefreshClick={() => refreshGridData(true)}
            gridRef={gridRef}
            toolbarOptions={{
              addProps: { show: false },
              searchProps: { show: false },
              statusProps: { show: false },
              moreProps: { show: false },
              deleteProps: { show: false },
              editProps: { show: false },
            }}
            {...props}
          />
        )}
        {...{ columnDefs }}
      />
      <FileViewModal
        open={showFileViewModal?.open!}
        onClose={() => setShowFileViewModal({ open: false, crmItem: undefined })}
        crmItem={showFileViewModal?.crmItem!}
      />
    </Box>
  )
}

export default CrmGrid
