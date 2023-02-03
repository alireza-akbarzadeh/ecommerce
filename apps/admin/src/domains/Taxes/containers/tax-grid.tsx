import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { GetTaxTypeValuesQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog, MenuItemProps } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import useTaxGrid from '../hooks/useTaxGrid'
import taxesMessages from '../taxes.messages'
import TaxForm from './tax-form'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 230,
  },
}

const TaxGrid = ({ data }: ICellRendererParams) => {
  const { formatMessage } = useIntl()

  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/GeneralData/TaxTypes/${data.id}/getAllValues`
  const gridRef = useRef<HBDataGridClientRef>(null)
  const {
    checkboxSelection,
    headerCheckboxSelection,
    handleChangedGridActions,
    taxGridColumns,
    refreshGridData,
    getToolbarMoreItems,
    changeStatus,
    gridLoading,
    handleRemoveTax,
  } = useTaxGrid(gridRef, data.id)

  const [openActive, setOpenActive] = useState(false)
  const [status, setStatus] = useState<boolean>()
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [isOpenAddEditDialog, setIsOpenAddEditDialog] = useState<{
    show: boolean
    data?: GetTaxTypeValuesQueryResult
  }>({
    show: false,
  })
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })

  const handleAddTax = () => {
    setIsOpenAddEditDialog({ show: true })
  }
  const handleEditTax = (props: GetTaxTypeValuesQueryResult) => {
    setIsOpenAddEditDialog({ show: true, data: props })
  }

  const handleDeleteTax = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.id)
      handleRemoveTax(ids, gridLoading, () => {
        setDeleteDialogState({ show: false, id: undefined })
        refreshGridData()
      })
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridActionColumn
          {...props}
          menuItems={[
            {
              label: formatMessage(phrasesMessages.public),
              children: [
                {
                  icon: 'pen',
                  label: formatMessage(phrasesMessages.edit),
                  onClick: () => handleEditTax(props.data),
                },
                {
                  icon: 'trashAlt',
                  label: formatMessage(phrasesMessages.delete),
                  onClick: () => {
                    setDeleteDialogState({ show: true })
                  },
                },
              ],
            },
          ]}
        />
      )
    },
    [selectedRows],
  )

  const columnDefs = useMemo(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 110,
        minWidth: 110,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        checkboxSelection,
        headerCheckboxSelection,
        showRowGroup: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
          innerRenderer: GridActions,
        },
      },
      ...taxGridColumns(),
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

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

  return (
    <>
      <Box height={350}>
        <HBDataGridClient
          actionUrl={actionUrl}
          onDoubleClick={(props) => handleEditTax(props?.data)}
          columnDefs={columnDefs}
          ref={gridRef}
          pagination
          paginationPageSize={5}
          classes={classes}
          rightHeader={
            <Typography variant="h5" fontWeight={'700'}>
              {formatMessage(taxesMessages.taxAmount)}
            </Typography>
          }
          rowSelection={'multiple'}
          enableRtl
          sideBar
          onSelectedChanged={(chosenRows) => setSelectedRows(chosenRows)}
          GridToolbar={(props) => (
            <HBDataGrigToolbar
              onChange={handleChangedGridActions}
              addProps={{ onClick: handleAddTax }}
              statusProps={{ show: false }}
              searchProps={{ show: false }}
              editProps={{
                disabled: selectedRows.length !== 1,
                onClick: (props) => handleEditTax(props?.data),
              }}
              deleteProps={{
                disabled: selectedRows.length === 0,
                onClick: () => {
                  setDeleteDialogState({ show: true })
                },
              }}
              refreshProps={{ onClick: () => refreshGridData(true) }}
              items={toolbarMoreItems}
              {...props}
            />
          )}
        />
      </Box>
      <HBDialog
        content={
          <TaxForm
            taxTypeData={data}
            taxData={isOpenAddEditDialog?.data}
            setIsOpenAddEditDialog={setIsOpenAddEditDialog}
            refreshGridData={refreshGridData}
          />
        }
        open={isOpenAddEditDialog.show}
        onClose={() => setIsOpenAddEditDialog({ show: false })}
        title={formatMessage(taxesMessages.interInformationTitle)}
      />
      <HBDialog
        content={formatMessage(taxesMessages.confirmationMessageDeleting, {
          msg: deleteDialogState?.id ? 1 : selectedRows.length,
        })}
        title={formatMessage(taxesMessages.confirmationTitleDeleting)}
        onAccept={handleDeleteTax}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
      <HBDialog
        content={formatMessage(taxesMessages.taxesChangeStateConfirm, {
          changeCount: selectedRows.length,
        })}
        title={formatMessage(taxesMessages.taxesChangeState)}
        onAccept={handleChangeActive}
        onReject={() => setOpenActive(false)}
        open={openActive}
        onClose={() => setOpenActive(false)}
        acceptBtn={formatMessage(phrasesMessages.confirm)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </>
  )
}
export default TaxGrid
