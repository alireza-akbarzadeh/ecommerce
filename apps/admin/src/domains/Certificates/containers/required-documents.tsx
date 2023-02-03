import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  usePostAdminCatalogCertificatesByIdAttachmentMutation,
  usePutAdminCatalogCertificatesByIdAttachmentAndAttachmentIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  HBAgGridClasses,
  HBDataGrigToolbar,
  HBDialog,
  HBInputBase,
  HBSwitch,
  MenuItemProps,
  openToast,
} from '@hasty-bazar/core'
import { Box, styled, Typography } from '@mui/material'
import { CheckboxSelectionCallbackParams, ColDef, ICellRendererParams } from 'ag-grid-community'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import certificatesMessages from '../certificates.messages'
import useRequiredDocsGrid from '../hooks/useRequiredDocsGrid'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 230,
  },
}

const CellBoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '100%',
}))

export type DocumentsDataGridProps = {
  title: string
  id: string
  isActive: boolean
}

const RequiredDocuments = (params: any) => {
  const { formatMessage } = useIntl()

  const router = useRouter()
  const { data, isDetailsGrid } = params
  const certificatesId: string = router?.query?.id?.[0] || data?.id || ''
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/certificates/${certificatesId}/attachment`
  const gridRef = useRef<HBDataGridClientRef>(null)

  const {
    getToolbarMoreItems,
    changeStatus,
    gridLoading,
    handleChangedGridActions,
    refreshGridData,
    handleRemoveCertificateAttach,
  } = useRequiredDocsGrid(gridRef, certificatesId)

  const [openActive, setOpenActive] = useState(false)
  const [status, setStatus] = useState<boolean>()

  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: number }>({
    show: false,
  })
  const [isAddOrEdit, setIsAddOrEdit] = useState(false)

  const [createCertificateAttach] = usePostAdminCatalogCertificatesByIdAttachmentMutation()
  const [editCertificateAttach] =
    usePutAdminCatalogCertificatesByIdAttachmentAndAttachmentIdMutation()

  const getAllRows = () => {
    let documentData: DocumentsDataGridProps[] = []
    gridRef.current!.api.forEachNode((node) => documentData.push(node.data))
    return documentData
  }

  const checkboxSelection = (params: CheckboxSelectionCallbackParams) => {
    return params.columnApi.getRowGroupColumns().length === 0
  }

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

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return { headerCheckboxSelection: true, cellRenderer: 'agGroupCellRenderer' }
  }, [])

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
        headerCheckboxSelection: checkboxSelection,
        showRowGroup: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
          innerRenderer: GridActions,
        },
      },
      {
        field: 'title',
        headerName: formatMessage(certificatesMessages.requiredDocTitle),
        filter: 'agTextColumnFilter',
        maxWidth: 250,
        cellRenderer: ({ setValue, data, value }: ICellRendererParams) =>
          data?.isAdd ? (
            <CellBoxStyle>
              <HBInputBase
                sx={{ height: 30, '& > label': { lineHeight: 1 } }}
                size="small"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue!(e.target.value)}
                value={value}
                autoFocus
              />
            </CellBoxStyle>
          ) : (
            data.title
          ),
      },
      {
        field: 'isActive',
        headerName: formatMessage(certificatesMessages.requiredDocStatus),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value, data, setValue }: ICellRendererParams) =>
          data?.isAdd ? (
            <HBSwitch defaultChecked value={value} onChange={(e, checked) => setValue!(checked)} />
          ) : (
            <HBSwitch
              checked={value}
              onChange={(e, checked) => {
                editCertificateAttach({
                  id: certificatesId,
                  attachmentId: data.id,
                  'client-name': 'hasty-bazar-admin',
                  'client-version': '1.0.0',
                  updateCertificateAttachmentModel: { isActive: checked },
                }).then((res: any) => {
                  if (res?.data?.success) {
                    openToast({
                      message: formatMessage(phrasesMessages.successUpdate),
                      type: 'success',
                    })
                    refreshGridData()
                  }
                })
              }}
            />
          ),
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  const handleAddDocs = () => {
    try {
      const row = { isActive: true, isAdd: true, docId: 0 }
      gridRef.current!.api.applyTransaction({ add: [row], addIndex: 0 })
      setIsAddOrEdit(true)
    } catch (e) {}
  }

  const handleDeleteCertificateAttach = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.id)
      handleRemoveCertificateAttach(ids, gridLoading, () => {
        setDeleteDialogState({ show: false, id: undefined })
        refreshGridData()
      })
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  const cancelAddProductGroupSubmission = () => {
    let docsData = gridRef.current!.api.getModel().getRow(0)
    gridRef.current!.api.applyTransaction({ remove: [docsData?.data] })!
    setIsAddOrEdit(false)
  }

  const addProductGroupSubmission = async () => {
    const newRow = gridRef.current!.api.getModel().getRow(0)

    let documentData = getAllRows()

    if (documentData.filter((doc) => doc?.id === newRow?.data.id && doc?.id).length > 0) {
      openToast({
        message: formatMessage(certificatesMessages.usableDocAddError),
        type: 'error',
      })
      return
    }
    gridLoading(true)
    createCertificateAttach({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id: certificatesId,
      createCertificateAttachmentModel: {
        isActive: newRow?.data.isActive,
        title: newRow?.data.title,
      },
    })
      .unwrap()
      .then(() => {
        refreshGridData()
        setIsAddOrEdit(false)
      })
      .catch(() => {})
      .finally(() => {
        gridLoading(false)
      })
  }

  const handleChangeStatus = (status: boolean) => {
    setStatus(status)
    setOpenActive(true)
  }

  const handleChangeActive = useCallback(async () => {
    changeStatus(
      status!,
      () => {
        refreshGridData()
        setStatus(undefined)
        setOpenActive(false)
      },
      certificatesId!,
    )
  }, [status])

  const toolbarMoreItems = useMemo<MenuItemProps[]>(
    //@ts-ignore
    () => getToolbarMoreItems(handleChangeStatus),
    [selectedRows],
  )

  return (
    <Box height={350} px={isDetailsGrid ? 8 : 0}>
      <HBDataGridClient
        serverSideFilteringAlwaysResets
        serverSideSortingAlwaysResets
        actionUrl={actionUrl}
        columnDefs={columnDefs}
        pagination
        paginationPageSize={25}
        rowSelection={'multiple'}
        enableRtl
        sideBar
        classes={classes}
        rightHeader={
          <Typography variant="h5" fontWeight={'700'}>
            {formatMessage(certificatesMessages.requiredDocuments)}
          </Typography>
        }
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={(chosenRows) => setSelectedRows(chosenRows)}
        detailRowAutoHeight
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ disabled: isAddOrEdit, onClick: handleAddDocs }}
            deleteProps={{
              disabled: selectedRows.length === 0,
              onClick: () => setDeleteDialogState({ show: true }),
            }}
            statusProps={{ label: formatMessage(certificatesMessages.isActive), show: true }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            searchProps={{ show: true, openPosition: 'right' }}
            editProps={{ show: false }}
            items={toolbarMoreItems}
            {...props}
          >
            <HBGrigToolbarItem
              icon="times"
              tooltip={formatMessage(phrasesMessages.cancel)}
              disabled={!isAddOrEdit}
              show={isAddOrEdit}
              onClick={cancelAddProductGroupSubmission}
            />
            <HBGrigToolbarItem
              icon="check"
              tooltip={formatMessage(phrasesMessages.confirm)}
              disabled={!isAddOrEdit}
              onClick={addProductGroupSubmission}
            />
          </HBDataGrigToolbar>
        )}
      />
      <HBDialog
        content={formatMessage(certificatesMessages.confirmationMessageDeletingDocs, {
          msg: deleteDialogState?.id ? 1 : selectedRows.length,
        })}
        title={formatMessage(certificatesMessages.confirmationTitleDeletingDocs)}
        onAccept={handleDeleteCertificateAttach}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />

      <HBDialog
        content={formatMessage(certificatesMessages.documentsChangeStateConfirm, {
          changeCount: selectedRows.length,
        })}
        title={formatMessage(certificatesMessages.documentsChangeState)}
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
export default RequiredDocuments
