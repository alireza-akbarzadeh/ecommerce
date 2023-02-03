import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import sideBarMessages from '@hasty-bazar-admin/core/translations/sidebar.messages'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import banksMessages from '@hasty-bazar-admin/domains/Banks/Banks.messages'
import { GetBankQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog, MenuItemProps } from '@hasty-bazar/core'
import { ICellRendererParams } from 'ag-grid-community'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { AddEditBankForm } from './containers'
import useBankGrid from './hooks/useBankGrid'

export const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 240px)`,
  },
}

const BanksPage = () => {
  const { formatMessage } = useIntl()
  const breadcrumbs = [
    { url: '/', title: formatMessage(sideBarMessages.dashboard) },
    { url: '#', title: formatMessage(sideBarMessages.banks) },
  ]
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/GeneralData/bank`
  const gridRef = useRef<HBDataGridClientRef>(null)

  const [openActive, setOpenActive] = useState(false)
  const [status, setStatus] = useState<boolean>()
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [isOpenAddEditDialog, setIsOpenAddEditDialog] = useState<{
    show: boolean
    data?: GetBankQueryResult
  }>({
    show: false,
  })
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })

  const {
    gridLoading,
    checkboxSelection,
    headerCheckboxSelection,
    bankGridColumns,
    handleChangedGridActions,
    refreshGridData,
    getToolbarMoreItems,
    changeStatus,
    handleRemoveBank,
  } = useBankGrid(gridRef)

  const handleAddBank = () => {
    setIsOpenAddEditDialog({ show: true })
  }
  const handleEditBank = (props: GetBankQueryResult) => {
    setIsOpenAddEditDialog({ show: true, data: props })
  }

  const handleDeleteBanks = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.id)
      handleRemoveBank(ids, gridLoading, () => {
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
                  onClick: () => handleEditBank(props.data),
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
      ...bankGridColumns(),
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
        id="banks-grid"
        actionUrl={actionUrl}
        onDoubleClick={(props) => handleEditBank(props?.data)}
        rightHeader={
          <BreadCrumbSection title={formatMessage(banksMessages.banks)} breadItems={breadcrumbs} />
        }
        columnDefs={columnDefs}
        classes={classes}
        pagination
        paginationPageSize={25}
        rowSelection={'multiple'}
        enableRtl
        sideBar
        detailRowAutoHeight
        ref={gridRef}
        onSelectedChanged={(chosenRows) => setSelectedRows(chosenRows)}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ onClick: handleAddBank }}
            statusProps={{ show: true }}
            editProps={{
              disabled: selectedRows.length !== 1,
              onClick: () => handleEditBank(selectedRows[0]),
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
          <AddEditBankForm
            bankData={isOpenAddEditDialog?.data}
            setIsOpenAddEditDialog={setIsOpenAddEditDialog}
            refreshGridData={refreshGridData}
          />
        }
        open={isOpenAddEditDialog.show}
        onClose={() => setIsOpenAddEditDialog({ show: false })}
        title={formatMessage(banksMessages.interInformation)}
      />
      <HBDialog
        content={formatMessage(banksMessages.confirmationMessageDeleting, {
          msg: deleteDialogState?.id ? 1 : selectedRows.length,
        })}
        title={formatMessage(banksMessages.confirmationTitleDeleting)}
        onAccept={handleDeleteBanks}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
      <HBDialog
        content={formatMessage(banksMessages.banksChangeStateConfirm, {
          changeCount: selectedRows.length,
        })}
        title={formatMessage(banksMessages.banksChangeState)}
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

export default BanksPage
