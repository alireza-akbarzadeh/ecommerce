import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBDataGridClient } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBDialog } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { FC } from 'react'
import CreateGridToolbar from '../../components/GridToolbar'
import { classes } from '../../Currencies.classes'
import { currenciesMessage } from '../../Currencies.message'
import useCurrenciesGrid from '../../hooks/useCurrenciesGrid'
import { SelectRowModel } from '../../types/types'
import CurrenciesAddEdit from '../CurrenciesAddEdit'

const CurrenciesGrid: FC = () => {
  const {
    actionUrl,
    breadcrumbs,
    autoGroupColumnDef,
    gridRef,
    selectedRows,
    isEditOrAdd,
    columnDefs,
    addEditDialogState,
    openActive,
    editId,
    deleteDialogState,
    formatMessage,
    handleChangedSelectedRows,
    handleEditItem,
    onDelete,
    handleChangedGridActions,
    refreshGridData,
    handleCancelClick,
    handleAddItem,
    handleChangeStatus,
    handleSave,
    handleChangeActive,
    setOpenActive,
    setDeleteDialogState,
    handleDelete,
  } = useCurrenciesGrid()

  return (
    <Box>
      <HBDataGridClient
        id="currencies-grid"
        classes={classes}
        actionUrl={actionUrl}
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(currenciesMessage.currencies)}
            breadItems={breadcrumbs}
          />
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
        onDoubleClick={(props) => handleEditItem(props?.data?.id)}
        GridToolbar={(props) => (
          <CreateGridToolbar<SelectRowModel>
            selectedRows={selectedRows}
            handleSetDeleteDialogState={onDelete}
            onGridActionsChange={handleChangedGridActions}
            onRefreshClick={() => refreshGridData(true)}
            gridRef={gridRef}
            onCancelClick={handleCancelClick}
            onEditClick={handleEditItem}
            onAddClick={handleAddItem}
            isEditOrAdd={isEditOrAdd}
            handleChangeStatus={handleChangeStatus}
            {...props}
          />
        )}
        {...{ columnDefs }}
        rowHeight={50}
        suppressRowClickSelection={isEditOrAdd}
      />
      <HBDialog
        content={formatMessage(currenciesMessage.areYouSureAboutTheDelete, {
          count: String(selectedRows.length > 1 ? selectedRows.length : 1),
        })}
        title={formatMessage(currenciesMessage.deletePeriodFilterOne)}
        onAccept={handleDelete}
        onReject={() => setDeleteDialogState({ show: false })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
      <HBDialog
        content={formatMessage(currenciesMessage.confirm, {
          changeCount: selectedRows.length,
        })}
        title={formatMessage(currenciesMessage.confirmTitle)}
        onAccept={handleChangeActive}
        onReject={() => setOpenActive(false)}
        open={openActive}
        onClose={() => setOpenActive(false)}
        acceptBtn={formatMessage(phrasesMessages.confirm)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
      {addEditDialogState && (
        <CurrenciesAddEdit
          onClose={handleCancelClick}
          open={addEditDialogState}
          id={editId}
          onSave={handleSave}
        />
      )}
    </Box>
  )
}

export default CurrenciesGrid
