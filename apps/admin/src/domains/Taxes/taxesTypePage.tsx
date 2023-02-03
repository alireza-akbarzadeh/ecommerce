import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import sideBarMessages from '@hasty-bazar-admin/core/translations/sidebar.messages'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { GetTaxTypesQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog, MenuItemProps } from '@hasty-bazar/core'
import { ICellRendererParams } from 'ag-grid-community'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { TaxGrid, TaxTypeForm } from './containers'
import useTaxesTypesGrid from './hooks/useTaxesTypesGrid'
import taxesMessages from './taxes.messages'

export const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 240px)`,
  },
}

const TaxesTypesPage = () => {
  const { formatMessage } = useIntl()
  const breadcrumbs = [
    { url: '/', title: formatMessage(sideBarMessages.dashboard) },
    { url: '#', title: formatMessage(sideBarMessages.taxes) },
  ]

  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/GeneralData/TaxTypes/GetAll`
  const gridRef = useRef<HBDataGridClientRef>(null)
  const {
    checkboxSelection,
    headerCheckboxSelection,
    handleChangedGridActions,
    taxTypeGridColumns,
    refreshGridData,
    getToolbarMoreItems,
    changeStatus,
    gridLoading,
    handleRemoveTaxType,
  } = useTaxesTypesGrid(gridRef)

  const [openActive, setOpenActive] = useState(false)
  const [status, setStatus] = useState<boolean>()
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [isOpenAddEditDialog, setIsOpenAddEditDialog] = useState<{
    show: boolean
    data?: GetTaxTypesQueryResult
  }>({
    show: false,
  })
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })

  const handleAddTax = () => {
    setIsOpenAddEditDialog({ show: true })
  }
  const handleEditTax = (props: GetTaxTypesQueryResult) => {
    setIsOpenAddEditDialog({ show: true, data: props })
  }

  const handleDeleteTaxesTypes = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.id)
      handleRemoveTaxType(ids, gridLoading, () => {
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
      ...taxTypeGridColumns(),
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
      <HBDataGridClient
        id="taxesTypes-page-grid"
        actionUrl={actionUrl}
        onDoubleClick={(props) => handleEditTax(props?.data)}
        columnDefs={columnDefs}
        ref={gridRef}
        pagination
        paginationPageSize={25}
        rowSelection={'multiple'}
        enableRtl
        sideBar
        rightHeader={
          <BreadCrumbSection title={formatMessage(taxesMessages.taxes)} breadItems={breadcrumbs} />
        }
        classes={classes}
        onSelectedChanged={(chosenRows) => setSelectedRows(chosenRows)}
        masterDetail
        detailCellRenderer={TaxGrid}
        detailRowHeight={370}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ onClick: handleAddTax }}
            statusProps={{ show: false }}
            editProps={{
              disabled: selectedRows.length !== 1,
              onClick: () => handleEditTax(selectedRows[0]),
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
      <HBDialog
        content={
          <TaxTypeForm
            taxTypeData={isOpenAddEditDialog?.data}
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
        onAccept={handleDeleteTaxesTypes}
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

export default TaxesTypesPage
