import {
  GridWorkflowActionColumn,
  HBExplanationSummary,
} from '@hasty-bazar/admin-shared/components'
import { HBDataGridClient } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { HBExplanation } from '@hasty-bazar/admin-shared/containers/HBExplanation'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import UserFormFinancialInfo from '@hasty-bazar-admin/domains/Users/components/UserFormFinancialInfo'
import useUserFinancialController from '@hasty-bazar-admin/domains/Users/containers/hooks/useUserFinancialController'
import userPageMessages from '@hasty-bazar-admin/domains/Users/UserPage.messages'
import {
  idrApi,
  usePostAdminIdrChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBDataGrigToolbar, HBDialog } from '@hasty-bazar/core'
import { Box, dialogClasses, paperClasses } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { useCallback, useMemo } from 'react'

const Account = () => {
  const {
    formatMessage,
    gridRef,
    selectedRows,
    stepDialog,
    setStepDialog,
    partyId,
    actionUrl,
    handleChangedSelectedRows,
    handleChangedGridActions,
    autoGroupColumnDef,
    toolbarMoreItems,
    handleEditUser,
    handleDeleteDialog,
    handleAddUser,
    refreshGridData,
    checkboxSelection,
    headerCheckboxSelection,
    userGridColumns,
    contentTypeModal,
    handleCopyAddress,
    createRoles,
    handleDeleteAccount,
  } = useUserFinancialController()

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridWorkflowActionColumn
          entityId={props?.data?.id}
          factor="1"
          stateMachineCode={
            props?.data?.iban ? String(StateMachineCode.Iban) : String(StateMachineCode.CardNumber)
          }
          useChangeState={usePostAdminIdrChangeStateMutation}
          useLazyGetStateList={
            idrApi.useLazyGetAdminIdrGetTransitionByEntityIdAndStateMachineCodeFactorQuery
          }
          {...props}
          menuItems={[
            {
              label: formatMessage(phrasesMessages.public),
              children: [
                {
                  icon: 'pen',
                  label: formatMessage(phrasesMessages.edit),
                  onClick: () => {
                    handleEditUser(props.data?.id)
                  },
                },
                {
                  icon: 'trashAlt',
                  label: formatMessage(phrasesMessages.delete),
                  onClick: handleDeleteDialog,
                },
                {
                  icon: 'copyAlt',
                  label: formatMessage(phrasesMessages.copy),
                  onClick: async () => {
                    await handleCopyAddress(props.data?.id)
                  },
                },
              ],
            },
          ]}
          onChangesState={refreshGridData}
        />
      )
    },
    [selectedRows],
  )

  const columnDefs = useMemo(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 120,
        minWidth: 120,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        checkboxSelection,
        headerCheckboxSelection,
        showRowGroup: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
          innerRenderer: GridActions,
        },
      },
      ...userGridColumns(),
    ],
    [],
  )

  return (
    <>
      <HBExplanation
        defaultExpanded
        summary={
          <HBExplanationSummary
            title={formatMessage(userPageMessages.accountInformation)}
            icon="store"
          />
        }
        detail={
          <Box sx={{ minHeight: 630 }}>
            <HBDataGridClient
              popupParent={document.body}
              actionUrl={actionUrl}
              onDoubleClick={(props) => handleEditUser(props.data?.id)}
              columnDefs={columnDefs}
              pagination
              paginationPageSize={25}
              rowSelection="multiple"
              enableRtl
              sideBar
              autoGroupColumnDef={autoGroupColumnDef}
              onSelectedChanged={handleChangedSelectedRows}
              detailCellRendererParams={{ title: formatMessage(userPageMessages.usersShowMore) }}
              detailRowAutoHeight
              ref={gridRef}
              GridToolbar={(props) => (
                <HBDataGrigToolbar
                  onChange={handleChangedGridActions}
                  addProps={{ disabled: selectedRows.length > 0, onClick: () => handleAddUser() }}
                  deleteProps={{ disabled: selectedRows.length !== 1, onClick: handleDeleteDialog }}
                  editProps={{
                    disabled: selectedRows.length !== 1,
                    onClick: () => handleEditUser(),
                  }}
                  refreshProps={{ onClick: () => refreshGridData(true) }}
                  items={toolbarMoreItems}
                  {...props}
                ></HBDataGrigToolbar>
              )}
            />
          </Box>
        }
      />
      <HBDialog
        content={formatMessage(
          contentTypeModal === 'delete'
            ? userPageMessages.dialogConfirmationFinancialDelete
            : userPageMessages.dialogConfirmationFinancialCopy,
        )}
        title={
          contentTypeModal === 'delete'
            ? formatMessage(phrasesMessages.delete)
            : formatMessage(phrasesMessages.doCopy)
        }
        onAccept={
          contentTypeModal === 'delete' ? () => handleDeleteAccount() : () => setStepDialog('tow')
        }
        onClose={() => setStepDialog(null)}
        onReject={() => setStepDialog(null)}
        open={stepDialog === 'one'}
        acceptBtn={formatMessage(phrasesMessages.yes)}
        rejectBtn={formatMessage(phrasesMessages.no)}
      />
      <HBDialog
        title={formatMessage(userPageMessages.accountInformation)}
        onAccept={
          contentTypeModal === 'copy'
            ? handleCopyAddress
            : contentTypeModal === 'create'
            ? handleAddUser
            : handleEditUser
        }
        onReject={() => setStepDialog(null)}
        onClose={() => setStepDialog(null)}
        open={stepDialog === 'tow'}
        sx={{
          [`& .${dialogClasses.container}`]: {
            [`& .${paperClasses.root}`]: {
              width: '100%',
              maxWidth: 600,
            },
          },
        }}
      >
        <UserFormFinancialInfo
          createRoles={createRoles}
          gridRef={gridRef}
          partyId={partyId}
          contentTypeModal={contentTypeModal}
          setStepDialog={setStepDialog}
        />
      </HBDialog>
    </>
  )
}

export default Account
