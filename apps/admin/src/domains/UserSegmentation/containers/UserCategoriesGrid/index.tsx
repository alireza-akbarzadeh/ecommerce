import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBChangeRecordHistory } from '@hasty-bazar/admin-shared/containers/HBChangeRecordHistory'
import { HBDataGridClient } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog, HBSelect } from '@hasty-bazar/core'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { StateCode } from '../../enums/UserCategoriesWorkFLow'
import { useUserCategoriesCodeController } from '../../hooks'
import UserCategoriesMessage from '../../messages/UserCategoriesMessage'
const classes: HBAgGridClasses = {
  wrapper: {
    height: 750,
  },
}

const ReportGrid: FC = () => {
  const { formatMessage } = useIntl()
  const {
    columnDefs,
    autoGroupColumnDef,
    handleChangedSelectedRows,
    gridRef,
    handleChangedGridActions,
    toolbarMoreItems,
    refreshGridData,
    actionUrl,
    breadcrumbs,
    selectedRows,
    handleDeleteUserCategories,
    openDialog,
    setOpenDialog,
    handleDeleteDialog,
    handleAddUserCategories,
    handleEditUserCategories,
    recordChangeHistory,
    setRecordChangeHistory,
  } = useUserCategoriesCodeController()

  return (
    <>
      <HBDataGridClient
        actionUrl={actionUrl}
        columnDefs={columnDefs}
        pagination
        serverSideFilteringAlwaysResets
        paginationPageSize={25}
        cacheBlockSize={25}
        rowSelection="multiple"
        rowHeight={55}
        enableRtl
        sideBar
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(UserCategoriesMessage.userCategories)}
            breadItems={breadcrumbs}
          />
        }
        serverSideSortingAlwaysResets
        classes={classes}
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        editUrl={'/userCategories/edit/'}
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ show: false }}
            statusProps={{ show: false }}
            deleteProps={{
              disabled: selectedRows.length !== 1,
              onClick: handleDeleteDialog,
            }}
            editProps={{
              disabled: selectedRows.length !== 1,
              onClick: () => handleEditUserCategories(),
            }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            items={toolbarMoreItems}
            searchProps={{ openPosition: 'right', show: true, inputWidth: 240 }}
            {...props}
          >
            <HBGrigToolbarItem
              icon="plus"
              sx={{ color: 'primary.main' }}
              tooltip={formatMessage(phrasesMessages.add)}
              show={true}
              onClick={() => handleAddUserCategories()}
            />
            <HBSelect
              sx={{ width: 150, height: 30, '& > label': { lineHeight: 1 } }}
              size="small"
              menuItem={[
                { title: formatMessage(phrasesMessages.all), value: StateCode.all },
                { title: formatMessage(phrasesMessages.draft), value: StateCode.draft },
                { title: formatMessage(phrasesMessages.active), value: StateCode.release },
                {
                  title: formatMessage(UserCategoriesMessage.deActive),
                  value: StateCode.deActive,
                },
              ]}
              label={formatMessage(UserCategoriesMessage.status)}
              onChange={({ target }) => handleChangedGridActions(target?.value, 'status')}
            />
          </HBDataGrigToolbar>
        )}
      />
      <HBDialog
        content={formatMessage(UserCategoriesMessage.dialogConfirmationContentCategory)}
        title={formatMessage(phrasesMessages.delete)}
        onAccept={() => handleDeleteUserCategories()}
        onClose={() => setOpenDialog(false)}
        onReject={() => setOpenDialog(false)}
        open={openDialog}
        acceptBtn={formatMessage(phrasesMessages.yes)}
        rejectBtn={formatMessage(phrasesMessages.no)}
      />
      <HBChangeRecordHistory
        open={recordChangeHistory.show}
        entityId={recordChangeHistory.entityId!}
        onClose={() => setRecordChangeHistory({ show: false, entityId: '' })}
        tableName="UserSegmentation"
      />
    </>
  )
}

export default ReportGrid
