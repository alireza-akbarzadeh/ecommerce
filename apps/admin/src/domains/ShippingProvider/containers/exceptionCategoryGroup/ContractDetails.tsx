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
import useExceptionCategoryGroup from './useExceptionCategoryGroup'
interface ExceptionDataGridProps {
  id: string
  shippingProviderId: string
  productCategoryId: string
  productCategoryTitle: string
  createdOn: Date
}

const ContractDetails = () => {
  const gridRef = useRef<HBDataGridClientRef>(null)
  const { formatMessage } = useIntl()
  const { categoryExceptionExcel } = useCreateGridToolbar()
  const router = useRouter()
  const id = router.query.id?.[0]
  const {
    selectedRows,
    setSelectRow,
    handleSetIsAddOrEdit,
    toolbarStatus,
    isAddOrEdit,
    handleEditCategoryGroup,
    handleSetDeleteDialogState,
    refreshGridData,
    CategoryGroupId,
    deleteDialogState,
    cancelAddCategoryGroupSubmission,
    cancelEditCategoryGroupSubmission,
    addCategoryGroupSubmission,
    editExceptionSubmission,
    deleteShippingProvider,
  } = useContractDetail(gridRef, id!)
  const { columnDefs, actionUrl } = useExceptionCategoryGroup(gridRef, CategoryGroupId, id!)

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
        CategoryGroupId: 0,
      }
      gridRef.current!.api.applyTransactionAsync({
        add: [row],
        addIndex: 0,
      })
      handleSetIsAddOrEdit(true)
    } catch (e) {}
  }

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef.current?.downloadGridData({
      downloadFileMethod: categoryExceptionExcel(),
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
    <Box sx={{ minHeight: 400 }}>
      <HBDataGridClient
        actionUrl={actionUrl}
        columnDefs={columnDefs}
        pagination
        paginationPageSize={25}
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
              onClick: () => handleEditCategoryGroup(selectedRows[0]?.id),
            }}
            deleteProps={{
              disabled: toolbarStatus.disabledOnNoSelected,
              onClick: () => handleSetDeleteDialogState({ show: true }),
            }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            items={toolbarMoreItems}
            {...props}
          >
            <HBGrigToolbarItem
              icon="times"
              tooltip={formatMessage(phrasesMessages.confirm)}
              disabled={!isAddOrEdit}
              show={isAddOrEdit}
              onClick={
                CategoryGroupId
                  ? cancelEditCategoryGroupSubmission
                  : cancelAddCategoryGroupSubmission
              }
            />
            <HBGrigToolbarItem
              icon="check"
              tooltip={formatMessage(phrasesMessages.confirm)}
              disabled={!isAddOrEdit}
              onClick={CategoryGroupId ? editExceptionSubmission : addCategoryGroupSubmission}
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
        onAccept={deleteShippingProvider}
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
