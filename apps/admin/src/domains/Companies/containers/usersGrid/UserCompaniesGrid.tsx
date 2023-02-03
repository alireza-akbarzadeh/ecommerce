import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useDeleteAdminIdrOrganizationByIdPartyAndPartyIdMutation,
  usePostAdminIdrOrganizationByIdPartyMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBAgGridClasses, HBDialog, openToast } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { FC, useCallback, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import companiesMessage from '../../companies.message'
import CreateGridToolbar from '../../components/CreateGridToolbar'
import { UsersSelectRowModel } from '../../types'
import { UsersList } from './containers'
import useUserCompaniesGrid from './useUserCompaniesGrid'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 300,
  },
}

export type UserCompaniesGridProps = {
  companyId?: string | null
}

const UserCompaniesGrid: FC<UserCompaniesGridProps> = ({ companyId }) => {
  const { formatMessage } = useIntl()

  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<UsersSelectRowModel[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })
  const [addEditDialogState, setAddEditDialogState] = useState(false)

  const [isEditOrAdd, setIsEditOrAdd] = useState(false)
  const [editId, setEditId] = useState<string>()

  const [deleteUserItem] = useDeleteAdminIdrOrganizationByIdPartyAndPartyIdMutation()
  const [addUserToCompany] = usePostAdminIdrOrganizationByIdPartyMutation()

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('isActive')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== -1 ? (value == 1 ? 'true' : 'false') : null,
        })
      gridRef.current!.api.onFilterChanged()
    } else if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'firstName', operator: 'contains', value: String(value) },
          { field: 'lastName', operator: 'contains', value: String(value) },
          { field: 'nationalCode', operator: 'contains', value: String(value) },
          { field: 'mobile', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchCompanies',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchCompanies')
      }
    }
  }

  const refreshGridData = (isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current?.api.deselectAll()
  }

  const handleChangedSelectedRows = (selectedRows: UsersSelectRowModel[]) => {
    setSelectedRows(selectedRows)
  }

  const handleDelete = useCallback(async () => {
    const ids = selectedRows.map((item) => item.partyId)
    gridRef.current?.api.showLoadingOverlay()
    for (const id of ids) {
      await deleteUserItem({
        'client-name': 'admin',
        'client-version': '1.0.0',
        id: companyId!,
        partyId: id!,
      }).then((res: any) => {
        if (res?.data?.success) {
          openToast({
            message: formatMessage(companiesMessage.successfullyDeleted),
            type: 'success',
          })
        }
      })
    }
    gridRef.current?.api.hideOverlay()
    refreshGridData()
    setDeleteDialogState({ show: false })
  }, [selectedRows, deleteDialogState])

  const onDelete = (show: boolean, id: string) => {
    setDeleteDialogState({ show, id })
  }

  const { actionUrl, columnDefs, autoGroupColumnDef } = useUserCompaniesGrid({
    gridRef,
    selectedRows,
    onDelete,
    editId,
    companyId: companyId!,
  })

  const handleAddItem = () => {
    setAddEditDialogState(true)
  }

  const handleCancelClick = () => {
    setAddEditDialogState(false)
    setIsEditOrAdd(false)
    setEditId(undefined)
  }

  const handleSave = (user: UsersSelectRowModel[]) => {
    handleCancelClick()
    const ids = user.map((item) => item.id)
    gridRef.current?.api.showLoadingOverlay()
    addUserToCompany({
      'client-name': 'admin',
      'client-version': '1.0.0',
      id: companyId!,
      body: ids,
    })
      .then((res: any) => {
        if (res?.data?.success) {
          openToast({
            message: formatMessage(companiesMessage.successfullyAdded),
            type: 'success',
          })
          refreshGridData()
        }
      })
      .finally(() => {
        gridRef.current?.api.hideOverlay()
      })
  }

  return (
    <Box>
      <HBDataGridClient
        classes={classes}
        actionUrl={companyId ? actionUrl : ''}
        rightHeader={
          <Typography variant="h6">{formatMessage(companiesMessage.userCompaniesTitle)}</Typography>
        }
        pagination
        paginationPageSize={25}
        rowSelection="multiple"
        enableRtl
        sideBar
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        serverSideSortingAlwaysResets
        serverSideFilteringAlwaysResets
        ref={gridRef}
        GridToolbar={(props) => (
          <CreateGridToolbar<UsersSelectRowModel>
            selectedRows={selectedRows}
            handleSetDeleteDialogState={onDelete}
            onGridActionsChange={handleChangedGridActions}
            onRefreshClick={() => refreshGridData(true)}
            gridRef={gridRef}
            onCancelClick={handleCancelClick}
            onAddClick={handleAddItem}
            isEditOrAdd={isEditOrAdd}
            isDisableAll={!companyId}
            toolbarOptions={{
              editProps: { show: false },
              moreProps: { show: false },
              searchProps: { show: true, openPosition: 'right', inputWidth: 160 },
            }}
            {...props}
          />
        )}
        {...{ columnDefs }}
        suppressRowClickSelection={isEditOrAdd}
      />
      <HBDialog
        content={formatMessage(companiesMessage.areYouSureAboutTheDeleteUser, {
          count: String(deleteDialogState?.id ? 1 : selectedRows.length),
        })}
        title={formatMessage(companiesMessage.deleteUserCompany)}
        onAccept={handleDelete}
        onReject={() => setDeleteDialogState({ show: false })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
      {addEditDialogState && (
        <UsersList
          onClose={() => setAddEditDialogState(false)}
          openDialog={addEditDialogState}
          onConfirm={handleSave!}
        />
      )}
    </Box>
  )
}

export default UserCompaniesGrid
