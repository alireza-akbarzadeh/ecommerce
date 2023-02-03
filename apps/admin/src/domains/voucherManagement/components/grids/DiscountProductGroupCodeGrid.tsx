import { HBDataGridClient } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useProductGroupCodeGridController from '@hasty-bazar-admin/domains/voucherManagement/Hook/gridController/useProductGroupCodeGridController'
import useProductGroupCodeGridColumnData from '@hasty-bazar-admin/domains/voucherManagement/Hook/gridData/useProductGroupCodeGridColumnData'
import { HBDataGrigToolbar, HBDialog, HBIcon } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import VoucherManagementPage from '../../VoucherManagementPage.messages'

const DiscountProductGroupCodeGrid = () => {
  const {
    gridRef,
    formatMessage,
    actionUrl,
    handleChangedGridActions,
    isAddOrEdit,
    toolbarStatus,
    autoGroupColumnDef,
    handleChangedSelectedRows,
    setDeleteDialogState,
    selectedRows,
    refreshGridData,
    deleteDialogState,
    addVoucherSubmission,
    cancelAddVoucherSubmission,
    handleDeleteVoucher,
    handleAddVoucher,
    checkboxSelection,
    headerCheckboxSelection,
    id,
    deleteLoading,
    classes,
    toolbarMoreItems,
  } = useProductGroupCodeGridController()

  const { columnDefs } = useProductGroupCodeGridColumnData({
    setDeleteDialogState,
    selectedRows,
    checkboxSelection,
    headerCheckboxSelection,
    id,
    gridRef,
    refreshGridData,
  })

  return (
    <Box
      bgcolor="common.white"
      sx={{
        pb: 8,
        pt: 6,
        px: 8,
        height: 700,
        border: (theme) => `1px solid ${theme.palette.grey[200]}`,
      }}
    >
      <HBDataGridClient
        rightHeader={
          <Box sx={{ display: 'flex', alignItem: 'center', gap: 2 }}>
            <HBIcon type={'historyAlt'} />
            <Typography variant={'h4'}>
              {formatMessage(VoucherManagementPage.productGroupCode)}
            </Typography>
          </Box>
        }
        serverSideFilteringAlwaysResets
        rowHeight={55}
        serverSideSortingAlwaysResets
        actionUrl={actionUrl}
        columnDefs={columnDefs}
        pagination
        classes={classes}
        paginationPageSize={25}
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
              disabled: toolbarStatus.disabledOnSelected || isAddOrEdit,
              onClick: () => handleAddVoucher(),
            }}
            deleteProps={{
              disabled: toolbarStatus.disabledOnNoSelected,
              onClick: () => setDeleteDialogState({ show: true }),
            }}
            editProps={{
              show: false,
            }}
            statusProps={{ show: false }}
            searchProps={{ openPosition: 'right', show: true, inputWidth: 200 }}
            items={toolbarMoreItems}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            {...props}
          >
            <HBGrigToolbarItem
              icon="times"
              tooltip={formatMessage(phrasesMessages.confirm)}
              disabled={!isAddOrEdit}
              show={isAddOrEdit}
              onClick={cancelAddVoucherSubmission}
            />
            <HBGrigToolbarItem
              icon="check"
              show={isAddOrEdit}
              tooltip={formatMessage(phrasesMessages.confirm)}
              disabled={!isAddOrEdit}
              onClick={addVoucherSubmission}
            />
          </HBDataGrigToolbar>
        )}
      />
      <HBDialog
        content={formatMessage(VoucherManagementPage.deleteDialogTitle, {
          msg: formatMessage(VoucherManagementPage.productOfGroup),
        })}
        title={formatMessage(VoucherManagementPage.productOfGroup)}
        onAccept={handleDeleteVoucher}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        loading={deleteLoading}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </Box>
  )
}

export default DiscountProductGroupCodeGrid
