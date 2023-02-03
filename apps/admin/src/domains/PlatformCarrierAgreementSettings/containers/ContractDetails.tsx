import HBDataGridClient, {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ColDef } from 'ag-grid-community'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import useContractDetails from '../hooks/useContractDetails'
import useContractDetailsColumnDefs from '../hooks/useContractDetailsColumnDefs'
import PlatformCarrierAgrrementsMessages from '../PlatformCarrierAgreementSettings.message'
import { ExceptionDataGridProps } from '../types'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 300,
  },
}

const ContractDetails = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const id = router.query.id?.[0]
  const [selectedRows, setSelectedRows] = useState<ExceptionDataGridProps[]>([])
  const gridRef = useRef<HBDataGridClientRef>(null)

  const {
    isAddOrEdit,
    handleAddException,
    handleEditException,
    deleteDialogState,
    setDeleteDialogState,
    cancelAddPlatformSubmission,
    addExceptionSubmission,
    editExceptionSubmission,
    cancelEditPlatformSubmission,
    deletePlatformShippingAgreements,
    exceptionId,
  } = useContractDetails({ gridRef, selectedRows, id: id! })

  const { columnDefs } = useContractDetailsColumnDefs({ gridRef, exceptionId })

  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/sale/api/PlatformShippingContract/${id}/Exceptions`

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0
    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api?.deselectAll()
  }, [])

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const handleChangedSelectedRows = (selectedRows: ExceptionDataGridProps[]) => {
    setSelectedRows(selectedRows)
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
    <Box height={400} mt={10}>
      <HBDataGridClient
        serverSideFilteringAlwaysResets
        serverSideSortingAlwaysResets
        actionUrl={actionUrl}
        {...{ columnDefs }}
        pagination
        paginationPageSize={25}
        rowSelection="multiple"
        enableRtl
        sideBar
        classes={classes}
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
              onClick: () => handleEditException(selectedRows[0]?.id),
            }}
            deleteProps={{
              disabled: toolbarStatus.disabledOnNoSelected,
              onClick: () => setDeleteDialogState({ show: true }),
            }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            items={[]}
            {...props}
          >
            <HBGrigToolbarItem
              icon="times"
              tooltip={formatMessage(phrasesMessages.confirm)}
              disabled={!isAddOrEdit}
              show={isAddOrEdit}
              onClick={exceptionId ? cancelEditPlatformSubmission : cancelAddPlatformSubmission}
            />
            <HBGrigToolbarItem
              icon="check"
              tooltip={formatMessage(phrasesMessages.confirm)}
              disabled={!isAddOrEdit}
              onClick={exceptionId ? editExceptionSubmission : addExceptionSubmission}
            />
          </HBDataGrigToolbar>
        )}
      />

      <HBDialog
        content={formatMessage(PlatformCarrierAgrrementsMessages.areYouSureOfException).replace(
          'count',
          String(deleteDialogState?.id ? 1 : selectedRows.length),
        )}
        title={formatMessage(
          PlatformCarrierAgrrementsMessages.deletePlatformShippingAgreementsException,
        )}
        onAccept={deletePlatformShippingAgreements}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </Box>
  )
}

export default ContractDetails
