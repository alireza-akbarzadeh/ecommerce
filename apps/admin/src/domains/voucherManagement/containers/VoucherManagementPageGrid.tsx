import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBDataGridClient } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useVoucherManagementController from '@hasty-bazar-admin/domains/voucherManagement/Hook/useVoucherManagementController'
import { HBDataGrigToolbar, HBDialog, HBSelect } from '@hasty-bazar/core'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import VoucherManagementPage from '../VoucherManagementPage.messages'
import { StatusStage } from '../enum/StatusStage'
const VoucherManagementPageGrid = () => {
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
    handleDeleteVoucher,
    refreshGridData,
    columnDefs,
    deleteLoading,
    status,
  } = useVoucherManagementController()

  return (
    <>
      <HBDataGridClient
        actionUrl={actionUrl}
        columnDefs={columnDefs}
        pagination
        paginationPageSize={25}
        rowSelection="multiple"
        editUrl={'/voucherManagement/edit/'}
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(VoucherManagementPage.VoucherTitle)}
            breadItems={breadcrumbs}
          />
        }
        classes={classes}
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        enableRtl
        sideBar
        detailCellRendererParams={{ title: VoucherManagementPage.viewDetails }}
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
            statusProps={{ show: false }}
            searchProps={{ openPosition: 'right', show: true, inputWidth: 250 }}
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
                { title: formatMessage(phrasesMessages.all), value: StatusStage.all },
                { title: formatMessage(phrasesMessages.draft), value: StatusStage.draft },
                { title: formatMessage(phrasesMessages.release), value: StatusStage.release },
                {
                  title: formatMessage(VoucherManagementPage.deActive),
                  value: StatusStage.deActive,
                },
              ]}
              label={formatMessage(VoucherManagementPage.status)}
              value={status}
              onChange={({ target }) => handleChangedGridActions(target?.value, 'status')}
            />
          </HBDataGrigToolbar>
        )}
      />
      <HBDialog
        content={formatMessage(phrasesMessages.dialogConfirmationDelete)}
        title={formatMessage(phrasesMessages.delete)}
        onAccept={() => handleDeleteVoucher()}
        onClose={() => setOpenDialog(false)}
        onReject={() => setOpenDialog(false)}
        open={openDialog}
        loading={deleteLoading}
        acceptBtn={formatMessage(VoucherManagementPage.yes)}
        rejectBtn={formatMessage(VoucherManagementPage.no)}
      />
    </>
  )
}

export default VoucherManagementPageGrid
