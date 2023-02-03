import HBDataGridClient, {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBDataGrigToolbar, HBDialog, MenuItemProps } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ColDef } from 'ag-grid-community'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import { useRouter } from 'next/router'
import { useMemo, useRef } from 'react'
import { useIntl } from 'react-intl'
import useCreateGridToolbar from '../../hooks/useCreateGridToolbar'
import ShippingProviderMessages from '../../shippingProvider.message'
import useContractDetail from './useContractDetail'
import useExclusionsOnWorkingDays from './useExclusionsOnWorkingDays'
interface ExceptionDataGridProps {
  id: string
  shippingProviderId: string
  productCategoryId: string
  productCategoryTitle: string
  createdOn: Date
}

const ContractDetails = () => {
  const gridRef = useRef<HBDataGridClientRef>(null)
  const { outOfServiceProgramExcel } = useCreateGridToolbar()
  const { formatMessage } = useIntl()
  const router = useRouter()
  const id = router.query.id?.[0]
  const {
    selectedRows,
    setSelectRow,
    handleSetIsAddOrEdit,
    toolbarStatus,
    isAddOrEdit,
    handleEditWorkingDays,
    handleSetDeleteDialogState,
    refreshGridData,
    workingDaysId,
    deleteDialogState,
    cancelAddWorkingDaysSubmission,
    cancelEditWorkingDaysSubmission,
    addWorkingDaysSubmission,
    editWorkingDaysSubmission,
    deleteWorkingDays,
  } = useContractDetail(gridRef, id!)
  const { columnDefs, actionUrl } = useExclusionsOnWorkingDays(gridRef.current!, workingDaysId, id!)

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef.current?.downloadGridData({
      downloadFileMethod: outOfServiceProgramExcel(),
      downloadAll: isDownloadAll,
    })
  }

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    return [
      {
        label: formatMessage(phrasesMessages.download),
        icon: 'fileDownload',
        onClick: handleDownloadPage,
      },
      {
        label: formatMessage(phrasesMessages.downloadAll),
        icon: 'fileDownloadAlt',
        onClick: () => handleDownloadPage(true),
      },
    ]
  }, [selectedRows])

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const handleChangedSelectedRows = (selectedRows: ExceptionDataGridProps[]) => {
    setSelectRow(selectedRows)
  }

  const handleAddException = () => {
    try {
      const row = {
        isRequird: false,
        isActive: true,
        isAdd: true,
        workingDaysId: 0,
      }
      gridRef.current!.api.applyTransactionAsync({
        add: [row],
        addIndex: 0,
      })
      handleSetIsAddOrEdit(true)
    } catch (e) {}
  }

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'VendorNationalCode', operator: 'contains', value: String(value) },
        ]
        gridRef?.current!.addFilter({
          id: 'searchContract',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef?.current!.removeFilter('searchContract')
      }
    }
  }

  return (
    <Box sx={{ Height: 400 }}>
      <HBDataGridClient
        serverSideFilteringAlwaysResets
        serverSideSortingAlwaysResets
        actionUrl={actionUrl}
        columnDefs={columnDefs}
        pagination
        paginationPageSize={25}
        cacheBlockSize={25}
        rowModelType={'serverSide'}
        serverSideStoreType={'full'}
        rowSelection="multiple"
        enableRtl
        sideBar
        sx={{ height: '350px !important' }}
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        detailRowAutoHeight
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{
              disabled: toolbarStatus.disabledOnSelected || isAddOrEdit,
              onClick: handleAddException,
            }}
            statusProps={{ show: false }}
            editProps={{
              disabled: selectedRows.length !== 1,
              onClick: () => handleEditWorkingDays(selectedRows[0].id),
            }}
            deleteProps={{
              disabled: toolbarStatus.disabledOnNoSelected,
              onClick: () => handleSetDeleteDialogState({ show: true }),
            }}
            refreshProps={{ onClick: () => refreshGridData() }}
            items={toolbarMoreItems}
            {...props}
          >
            <HBGrigToolbarItem
              icon="times"
              tooltip={formatMessage(phrasesMessages.confirm)}
              disabled={!isAddOrEdit}
              show={isAddOrEdit}
              onClick={
                workingDaysId ? cancelEditWorkingDaysSubmission : cancelAddWorkingDaysSubmission
              }
            />
            <HBGrigToolbarItem
              icon="check"
              tooltip={formatMessage(phrasesMessages.confirm)}
              disabled={!isAddOrEdit}
              onClick={workingDaysId ? editWorkingDaysSubmission : addWorkingDaysSubmission}
            />
          </HBDataGrigToolbar>
        )}
      />
      <HBDialog
        content={formatMessage(ShippingProviderMessages.areYouSure).replace(
          'count',
          String(deleteDialogState?.id ? 1 : selectedRows.length),
        )}
        title={formatMessage(ShippingProviderMessages.deleteProductGroupException)}
        onAccept={deleteWorkingDays}
        onReject={() => handleSetDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        onClose={() => handleSetDeleteDialogState({ show: false, id: undefined })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </Box>
  )
}

export default ContractDetails
