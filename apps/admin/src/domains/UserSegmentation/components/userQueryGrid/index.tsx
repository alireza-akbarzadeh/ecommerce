import { HBDataGridClient } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBDataGrigToolbar, HBDialog, HBIconButton, HBMenu } from '@hasty-bazar/core'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import { FC } from 'react'
import { ListCreationTypeCodeEnum } from '../../enums/UserCategoriesValidationFormEnum'
import { useUserCategoriesCodeColumnData, useUserQueryGridController } from '../../hooks'
import UserCategoriesMessage from '../../messages/UserCategoriesMessage'
import { IQueryResult } from '../../types/IUserCategories'
const UserQueryGrid: FC<IQueryResult> = ({ isDirty, listCreationType, data }) => {
  const {
    gridRef,
    formatMessage,
    handleChangedGridActions,
    isAddOrEditUser,
    toolbarStatus,
    autoGroupColumnDef,
    handleChangedSelectedRows,
    setDeleteDialogState,
    selectedRows,
    refreshGridData,
    deleteDialogState,
    cancelAddVoucherSubmission,
    userAddCategoriesSubmission,
    handleAddUserCategories,
    handleDeleteUserCategories,
    setOpenActive,
    checkboxSelection,
    headerCheckboxSelection,
    deleteLoading,
    classes,
    actionUrl,
    handleCallQueryResult,
    handleAddUserPhone,
    isAddOrEditPhone,
    addPhoneCategoriesSubmission,
  } = useUserQueryGridController()

  const { columnDefs, toolbarMoreItems } = useUserCategoriesCodeColumnData({
    setDeleteDialogState,
    selectedRows,
    checkboxSelection,
    headerCheckboxSelection,
    gridRef,
    refreshGridData,
    setOpenActive,
    data: data?.data,
  })

  const isDisabled = isDirty || isAddOrEditUser || isAddOrEditPhone
  return (
    <>
      <HBDataGridClient
        actionUrl={actionUrl}
        serverSideFilteringAlwaysResets
        rowHeight={55}
        serverSideSortingAlwaysResets
        columnDefs={columnDefs}
        sx={{ height: '400px !important' }}
        pagination
        classes={classes}
        paginationPageSize={25}
        cacheBlockSize={25}
        rowSelection="multiple"
        enableRtl
        sideBar
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        detailRowAutoHeight
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{
              show: false,
            }}
            deleteProps={{
              disabled: toolbarStatus.disabledOnNoSelected,
              onClick: () => setDeleteDialogState({ show: true }),
            }}
            editProps={{
              show: false,
            }}
            moreProps={{ disabled: isAddOrEditUser || isAddOrEditPhone }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            searchProps={{ openPosition: 'right', show: true, inputWidth: 240 }}
            items={toolbarMoreItems}
            {...props}
          >
            <HBGrigToolbarItem
              icon="creditCardSearch"
              tooltip={formatMessage(UserCategoriesMessage.getQueryResults)}
              disabled={isDirty || listCreationType?.id === String(ListCreationTypeCodeEnum.Manual)}
              onClick={handleCallQueryResult}
            />
            <HBGrigToolbarItem
              icon="times"
              tooltip={formatMessage(phrasesMessages.cancel)}
              disabled={!isAddOrEditUser && !isAddOrEditPhone}
              show={isAddOrEditUser || isAddOrEditPhone}
              onClick={cancelAddVoucherSubmission}
            />

            <HBGrigToolbarItem
              icon="check"
              show={isAddOrEditUser || isAddOrEditPhone}
              tooltip={formatMessage(phrasesMessages.confirm)}
              disabled={isDirty}
              onClick={isAddOrEditUser ? userAddCategoriesSubmission : addPhoneCategoriesSubmission}
            />
            <HBMenu
              contentComponentType="div"
              content={
                <HBIconButton
                  type="button"
                  icon="plus"
                  name="plus"
                  disabled={
                    isDisabled || listCreationType?.id !== String(ListCreationTypeCodeEnum.Manual)
                  }
                />
              }
              menus={[
                {
                  content: formatMessage(UserCategoriesMessage.addPhone),
                  onClick: () => handleAddUserPhone(),
                  disabled: isDisabled,
                },
                {
                  content: formatMessage(UserCategoriesMessage.selectUser),
                  disabled: isDisabled,
                  onClick: () => handleAddUserCategories(),
                },
              ]}
            />
          </HBDataGrigToolbar>
        )}
      />

      <HBDialog
        content={formatMessage(UserCategoriesMessage.dialogConfirmationContentCategory, {
          count: selectedRows?.length,
        })}
        title={formatMessage(UserCategoriesMessage.userCategories)}
        onAccept={handleDeleteUserCategories}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        loading={deleteLoading}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </>
  )
}

export default UserQueryGrid
