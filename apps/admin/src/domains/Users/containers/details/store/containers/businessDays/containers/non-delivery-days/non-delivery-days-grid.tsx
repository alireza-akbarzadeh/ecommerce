import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetHolidayDatesQueryResult,
  GetVendorStoreResultApiResult,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useCallback, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import businessDaysMessages from '../../businessDays.messages'
import useNonDeliveryDaysGrid from '../../hooks/useNonDeliveryDaysGrid'
import AddFormDialog from './add-form-dialog'

type NonDeliveryDaysGridProps = {
  actionUrl?: string
  vendorData: GetVendorStoreResultApiResult
}
export type AddEditNonDeliveryModalType = {
  show: boolean
  data?: GetHolidayDatesQueryResult
}

const classes: HBAgGridClasses = {
  wrapper: {
    height: 300,
  },
}

const NonDeliveryDaysGrid = (props: NonDeliveryDaysGridProps) => {
  const { actionUrl = '', vendorData } = props
  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<GetHolidayDatesQueryResult[]>([])
  const [isOpenAddDialog, setIsOpenAddDialog] = useState<AddEditNonDeliveryModalType>({
    show: false,
  })
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })

  const { columnDefs, refreshGridData, handleRemoveHolidayDay, gridLoading } =
    useNonDeliveryDaysGrid(gridRef, vendorData, setDeleteDialogState)

  const handleDeleteHolidayDays = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.id)
      handleRemoveHolidayDay(ids as string[], gridLoading, () => {
        setDeleteDialogState({ show: false, id: undefined })
        refreshGridData()
      })
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  return (
    <Box sx={{ height: 400 }} mt={4}>
      <HBDataGridClient
        actionUrl={actionUrl}
        pagination
        paginationPageSize={10}
        rowSelection={'multiple'}
        classes={classes}
        columnDefs={columnDefs}
        detailRowAutoHeight
        ref={gridRef}
        onSelectedChanged={(chosenRows) => setSelectedRows(chosenRows)}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            addProps={{ onClick: () => setIsOpenAddDialog({ show: true, data: undefined }) }}
            deleteProps={{
              disabled: selectedRows.length === 0,
              onClick: () => setDeleteDialogState({ show: true }),
            }}
            editProps={{ show: false }}
            searchProps={{ show: false }}
            statusProps={{ show: false }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            {...props}
          ></HBDataGrigToolbar>
        )}
      />
      <HBDialog
        content={
          <AddFormDialog
            setIsOpenAddDialog={setIsOpenAddDialog}
            refreshGridData={refreshGridData}
            vendorData={vendorData}
          />
        }
        open={isOpenAddDialog.show}
        onClose={() => setIsOpenAddDialog({ show: false })}
        title={formatMessage(businessDaysMessages.detailsOfHolidayDays)}
        maxWidth={'xs'}
        fullWidth
      />
      <HBDialog
        content={formatMessage(businessDaysMessages.confirmationMessageDeletingNonDelivery, {
          msg: deleteDialogState?.id ? 1 : selectedRows.length,
        })}
        title={formatMessage(businessDaysMessages.confirmationTitleDeletingNonDelivery)}
        onAccept={handleDeleteHolidayDays}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </Box>
  )
}

export default NonDeliveryDaysGrid
