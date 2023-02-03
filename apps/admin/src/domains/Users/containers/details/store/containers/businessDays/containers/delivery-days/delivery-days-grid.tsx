import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  GetVendorStoreResultApiResult,
  GetWorkingDaysQueryResult,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog } from '@hasty-bazar/core'
import { Box, MenuItemProps } from '@mui/material'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import businessDaysMessages from '../../businessDays.messages'
import useDeliveryDaysGrid from '../../hooks/useDeliveryDaysGrid'
import AddEditFormDialog from './add-edit-form-dialog'

type DeliveryDaysGridProps = {
  actionUrl?: string
  vendorData: GetVendorStoreResultApiResult
}

const classes: HBAgGridClasses = {
  wrapper: {
    height: 300,
  },
}

export type AddEditModalType = {
  show: boolean
  data?: GetWorkingDaysQueryResult
}

const DeliveryDaysGrid = (props: DeliveryDaysGridProps) => {
  const { actionUrl = '', vendorData } = props
  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)

  const [openActive, setOpenActive] = useState(false)
  const [status, setStatus] = useState<boolean>()
  const [selectedRows, setSelectedRows] = useState<GetWorkingDaysQueryResult[]>([])
  const [isOpenAddEditDialog, setIsOpenAddEditDialog] = useState<AddEditModalType>({
    show: false,
  })
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })

  const {
    columnDefs,
    handleChangedGridActions,
    getToolbarMoreItems,
    refreshGridData,
    changeStatus,
    handleRemoveWorkingDay,
    gridLoading,
  } = useDeliveryDaysGrid(gridRef, setIsOpenAddEditDialog, vendorData, setDeleteDialogState)

  const { data: { data: { items: WeekDaysData = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery({
      'client-name': 'generalData',
      'client-version': '0',
      businessTypeCode: BusinessTypeEnums.WeekDays,
      pageSize: 1000,
    })

  const { data: { data: { items: DayTypeData = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery({
      'client-name': 'generalData',
      'client-version': '0',
      businessTypeCode: BusinessTypeEnums.DayType,
      pageSize: 1000,
    })

  const handleChangeStatus = (status: boolean) => {
    setStatus(status)
    setOpenActive(true)
  }

  const handleChangeActive = useCallback(async () => {
    changeStatus(status!, () => {
      refreshGridData()
      setStatus(undefined)
      setOpenActive(false)
    })
  }, [status])

  const toolbarMoreItems = useMemo<MenuItemProps[]>(
    //@ts-ignore
    () => getToolbarMoreItems(handleChangeStatus),
    [selectedRows],
  )

  const handleDeleteWorkingDays = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.workingDaysId)
      handleRemoveWorkingDay(ids as string[], gridLoading, () => {
        setDeleteDialogState({ show: false, id: undefined })
        refreshGridData()
      })
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  return (
    <Box sx={{ height: 400 }} mt={4}>
      <HBDataGridClient
        actionUrl={actionUrl}
        onDoubleClick={(props) => setIsOpenAddEditDialog({ show: true, data: props?.data })}
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
            addProps={{ onClick: () => setIsOpenAddEditDialog({ show: true, data: undefined }) }}
            editProps={{
              disabled: selectedRows.length !== 1,
              onClick: () => setIsOpenAddEditDialog({ show: true, data: selectedRows[0] }),
            }}
            deleteProps={{
              disabled: selectedRows.length === 0,
              onClick: () => setDeleteDialogState({ show: true }),
            }}
            searchProps={{ show: true, inputWidth: 114 }}
            //@ts-ignore
            items={toolbarMoreItems}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            onChange={handleChangedGridActions}
            statusProps={{ show: true }}
            {...props}
          />
        )}
      />
      <HBDialog
        content={
          <AddEditFormDialog
            data={isOpenAddEditDialog?.data}
            setIsOpenAddEditDialog={setIsOpenAddEditDialog}
            refreshGridData={refreshGridData}
            WeekDaysData={WeekDaysData}
            DayTypeData={DayTypeData}
            vendorData={vendorData}
          />
        }
        open={isOpenAddEditDialog.show}
        onClose={() => setIsOpenAddEditDialog({ show: false })}
        title={formatMessage(businessDaysMessages.detailsOfDeliveryDays)}
        maxWidth={'md'}
        fullWidth
      />
      <HBDialog
        content={formatMessage(businessDaysMessages.confirmationMessageDeleting, {
          msg: deleteDialogState?.id ? 1 : selectedRows.length,
        })}
        title={formatMessage(businessDaysMessages.confirmationTitleDeleting)}
        onAccept={handleDeleteWorkingDays}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
      <HBDialog
        content={formatMessage(businessDaysMessages.workingDaysChangeStateConfirm, {
          changeCount: selectedRows.length,
        })}
        title={formatMessage(businessDaysMessages.workingDaysChangeState)}
        onAccept={handleChangeActive}
        onReject={() => setOpenActive(false)}
        open={openActive}
        onClose={() => setOpenActive(false)}
        acceptBtn={formatMessage(phrasesMessages.confirm)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </Box>
  )
}

export default DeliveryDaysGrid
