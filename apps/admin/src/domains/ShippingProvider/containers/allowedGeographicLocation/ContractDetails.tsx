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
import useAllowedGeographicLocation from './useAllowedGeographicLocation'
import useContractDetails from './useContractDetail'

interface ExceptionDataGridProps {
  id: string
  shippingProviderId: string
  providerCityId: string
  platformCityId: string
  platformCityName: string
  createdOn: Date
}

const ContractDetails = () => {
  const gridRef = useRef<HBDataGridClientRef>(null)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const id = router.query.id?.[0]
  const { mappingCitiesExcel } = useCreateGridToolbar(id)
  const {
    selectedRows,
    setSelectRow,
    handleSetIsAddOrEdit,
    toolbarStatus,
    isAddOrEdit,
    handleEditGeographicLocation,
    handleSetDeleteDialogState,
    refreshGridData,
    geographicLocationId,
    deleteDialogState,
    cancelAddGeographicLocationSubmission,
    cancelEditGeographicLocationSubmission,
    addGeographicLocationSubmission,
    editGeographicLocationSubmission,
    deleteGeographicLocation,
  } = useContractDetails(gridRef, id!)
  const { columnDefs, actionUrl } = useAllowedGeographicLocation(
    gridRef.current!,
    geographicLocationId,
    id!,
  )

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef.current?.downloadGridData({
      downloadFileMethod: mappingCitiesExcel(),
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
        geographicLocationId: 0,
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
              onClick: () => handleEditGeographicLocation(selectedRows[0].id),
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
                geographicLocationId
                  ? cancelEditGeographicLocationSubmission
                  : cancelAddGeographicLocationSubmission
              }
            />
            <HBGrigToolbarItem
              icon="check"
              tooltip={formatMessage(phrasesMessages.confirm)}
              disabled={!isAddOrEdit}
              onClick={
                geographicLocationId
                  ? editGeographicLocationSubmission
                  : addGeographicLocationSubmission
              }
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
        onAccept={deleteGeographicLocation}
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
