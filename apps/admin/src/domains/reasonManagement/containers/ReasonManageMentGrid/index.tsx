import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBDataGridClient } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { StateCode } from '@hasty-bazar/admin-shared/core/enums/ReasonMangementType'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBDataGrigToolbar, HBDialog, HBSelect } from '@hasty-bazar/core'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import { useReasonManagementGridController } from '../../hooks'
import ReasonManageMentGridMessages from '../../ReasonManageMent.messages'

const ReasonManageMentGrid = () => {
  const {
    gridRef,
    actionUrl,
    formatMessage,
    selectedRows,
    autoGroupColumnDef,
    toolbarMoreItems,
    classes,
    breadcrumbs,
    openDialog,
    setOpenDialog,
    handleChangedSelectedRows,
    handleEditVoucher,
    handleChangedGridActions,
    handleDeleteDialog,
    handleAddVoucher,
    handleDeleteReason,
    refreshGridData,
    columnDefs,
    isLoading,
    status,
  } = useReasonManagementGridController()

  return (
    <>
      <HBDataGridClient
        actionUrl={actionUrl}
        columnDefs={columnDefs}
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(ReasonManageMentGridMessages.reasonsSettingsManagement)}
            breadItems={breadcrumbs}
          />
        }
        pagination
        paginationPageSize={25}
        rowSelection="multiple"
        enableRtl
        sideBar
        editUrl={'/reasonManagement/edit/'}
        classes={classes}
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        detailRowAutoHeight
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ show: false }}
            deleteProps={{
              disabled: selectedRows.length !== 1,
              onClick: handleDeleteDialog,
            }}
            editProps={{
              disabled: selectedRows.length !== 1,
              onClick: () => handleEditVoucher(),
            }}
            searchProps={{ show: true, inputWidth: 240, openPosition: 'right' }}
            statusProps={{ show: false }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            items={toolbarMoreItems}
            {...props}
          >
            <HBGrigToolbarItem
              icon="plus"
              sx={{ color: 'primary.main' }}
              tooltip={formatMessage(phrasesMessages.add)}
              show={true}
              onClick={() => handleAddVoucher()}
            />
            <HBSelect
              sx={{ width: 150, height: 30, '& > label': { lineHeight: 1 } }}
              size="small"
              menuItem={[
                { title: formatMessage(phrasesMessages.all), value: StateCode.all },
                { title: formatMessage(phrasesMessages.draft), value: StateCode.draft },
                { title: formatMessage(phrasesMessages.active), value: StateCode.active },
                {
                  title: formatMessage(ReasonManageMentGridMessages.deActive),
                  value: StateCode.deActive,
                },
              ]}
              value={status}
              label={formatMessage(ReasonManageMentGridMessages.status)}
              onChange={({ target }) => handleChangedGridActions(target?.value, 'status')}
            />
          </HBDataGrigToolbar>
        )}
      ></HBDataGridClient>
      <HBDialog
        content={formatMessage(ReasonManageMentGridMessages.dialogConfirmDelete)}
        title={formatMessage(phrasesMessages.delete)}
        onAccept={() => handleDeleteReason()}
        onClose={() => setOpenDialog(false)}
        onReject={() => setOpenDialog(false)}
        open={openDialog}
        acceptBtn={formatMessage(phrasesMessages.confirm)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
        loading={isLoading}
      />
    </>
  )
}

export default ReasonManageMentGrid
