import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBAgGridClasses, HBDialog } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { FC, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import companiesMessage from '../../../../companies.message'
import CreateGridToolbar from '../../../../components/CreateGridToolbar'
import { UsersSelectRowModel } from '../../../../types'
import useUserCompaniesGrid from './useUsersList'

const classes: HBAgGridClasses = {
  wrapper: {
    height: {
      md: 440,
      lg: 540,
    },
  },
}

export type UserCompaniesGridProps = {
  openDialog: boolean
  onClose: () => void
  onConfirm: (user: UsersSelectRowModel[]) => void
}

const UserList: FC<UserCompaniesGridProps> = ({ openDialog, onClose, onConfirm }) => {
  const { formatMessage } = useIntl()

  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<UsersSelectRowModel[]>([])

  const refreshGridData = (isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current?.api.deselectAll()
  }

  const handleChangedSelectedRows = (selectedRows: UsersSelectRowModel[]) => {
    setSelectedRows(selectedRows)
  }

  const { actionUrl, columnDefs, autoGroupColumnDef } = useUserCompaniesGrid({
    gridRef,
  })

  const handleSave = () => {
    onConfirm(gridRef.current?.api.getSelectedRows() as UsersSelectRowModel[])
  }

  const handleCancel = () => {
    onClose()
  }

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'FirstName', operator: 'contains', value: String(value) },
          { field: 'LastName', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchUsers',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchUsers')
      }
    }
  }

  return (
    <HBDialog
      title={formatMessage(companiesMessage.usersCompaniesModalTitle)}
      open={openDialog}
      onReject={handleCancel}
      onClose={handleCancel}
    >
      <Box
        width={700}
        maxWidth="100%"
        sx={{
          height: {
            md: 540,
            lg: 650,
          },
        }}
      >
        <HBDataGridClient
          classes={classes}
          actionUrl={actionUrl}
          rightHeader={<></>}
          pagination
          paginationPageSize={25}
          rowSelection="multiple"
          enableRtl
          autoGroupColumnDef={autoGroupColumnDef}
          onSelectedChanged={handleChangedSelectedRows}
          serverSideSortingAlwaysResets
          serverSideFilteringAlwaysResets
          ref={gridRef}
          GridToolbar={(props) => (
            <CreateGridToolbar<UsersSelectRowModel>
              selectedRows={selectedRows}
              handleSetDeleteDialogState={() => {}}
              onGridActionsChange={handleChangedGridActions}
              onRefreshClick={() => refreshGridData(true)}
              gridRef={gridRef}
              toolbarOptions={{
                editProps: { show: false },
                deleteProps: { show: false },
                statusProps: { show: false },
                moreProps: { show: false },
                searchProps: { openPosition: 'right' },
                addProps: {
                  icon: 'check',
                  tooltip: formatMessage(phrasesMessages.confirm),
                  onClick: handleSave,
                  disabled: selectedRows.length === 0,
                },
              }}
              {...props}
            />
          )}
          {...{ columnDefs }}
        />
      </Box>
    </HBDialog>
  )
}

export default UserList
