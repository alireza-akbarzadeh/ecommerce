import { HBDataGridClient } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBDataGrigToolbar, HBDialog, HBIcon } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import { useVoucherContext, VoucherContextType } from '../../context'
import useSellerCodeGridController from '../../Hook/gridController/useSellerCodeGridController'
import useSellerCodeGridColumnData from '../../Hook/gridData/useSellerCodeGridColumnData'
import VoucherManagementPage from '../../VoucherManagementPage.messages'

const DiscountCodeGrid = () => {
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
    handleDeleteSeller,
    handleAddVoucher,
    checkboxSelection,
    headerCheckboxSelection,
    id,
    deleteLoading,
    classes,
    toolbarMoreItems,
  } = useSellerCodeGridController()

  const { columnDefs } = useSellerCodeGridColumnData({
    setDeleteDialogState,
    selectedRows,
    checkboxSelection,
    headerCheckboxSelection,
    id,
    gridRef,
    refreshGridData,
  })
  const { isVendorExpandable } = useVoucherContext() as VoucherContextType

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
              {formatMessage(VoucherManagementPage.sellerCodeDiscount)}
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
              show: !isVendorExpandable,
            }}
            deleteProps={{
              disabled: toolbarStatus.disabledOnNoSelected,
              onClick: () => setDeleteDialogState({ show: true }),
            }}
            editProps={{
              show: false,
            }}
            items={toolbarMoreItems}
            statusProps={{ show: false }}
            searchProps={{ openPosition: 'right', inputWidth: 200, show: true }}
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
          msg: formatMessage(VoucherManagementPage.sellerCode),
        })}
        title={formatMessage(VoucherManagementPage.sellerCode)}
        onAccept={handleDeleteSeller}
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

export default DiscountCodeGrid
