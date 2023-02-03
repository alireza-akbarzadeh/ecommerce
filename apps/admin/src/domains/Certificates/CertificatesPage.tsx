import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import sidebarMessages from '@hasty-bazar-admin/core/translations/sidebar.messages'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog, MenuItemProps } from '@hasty-bazar/core'
import { Avatar } from '@mui/material'
import { CheckboxSelectionCallbackParams, ICellRendererParams } from 'ag-grid-community'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import certificatesMessages from './certificates.messages'
import { ActivationCertificates } from './containers'
import RequiredDocuments from './containers/required-documents'
import useCertificatesGrid from './hooks/useCertificatesGrid'

const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 240px)`,
  },
}

const CertificatePage = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()

  const breadcrumbs = [
    { url: '/', title: formatMessage(sidebarMessages.dashboard) },
    { url: '#', title: formatMessage(sidebarMessages.certificates) },
  ]
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/certificates`
  const gridRef = useRef<HBDataGridClientRef>(null)

  const {
    getToolbarMoreItems,
    changeStatus,
    gridLoading,
    handleChangedGridActions,
    refreshGridData,
    handleRemoveCertificate,
  } = useCertificatesGrid(gridRef)

  const [openActive, setOpenActive] = useState(false)
  const [status, setStatus] = useState<boolean>()
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: number }>({
    show: false,
  })

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
              label: '',
              children: [
                {
                  icon: 'pen',
                  label: formatMessage(phrasesMessages.edit),
                  onClick: () => {
                    handleEditCertificates(props.data?.id)
                  },
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
        headerName: formatMessage(certificatesMessages.title),
        filter: 'agTextColumnFilter',
        minWidth: 300,
      },
      {
        field: 'icon',
        headerName: formatMessage(certificatesMessages.icon),
        filter: 'agNumberColumnFilter',
        minWidth: 100,
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <Avatar
              sizes="small"
              src={`${process.env.NEXT_PUBLIC_CDN}/${params.value}`}
              alt={params?.data?.name}
              variant="rounded"
            />
          )
        },
      },
      {
        field: 'isActive',
        headerName: formatMessage(certificatesMessages.isActive),
        filter: 'agTextColumnFilter',
        minWidth: 100,
        cellRenderer: ({ data }: ICellRendererParams) => (
          <ActivationCertificates data={data} refreshGridData={refreshGridData} />
        ),
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  const handleEditCertificates = (id?: string): void => {
    router.push(`certificates/edit/${id && typeof id === 'string' ? id : selectedRows[0].id}`)
  }

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

  const handleDeleteCertificates = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.id)
      handleRemoveCertificate(ids, gridLoading, () => {
        setDeleteDialogState({ show: false, id: undefined })
        refreshGridData()
      })
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  return (
    <>
      <HBDataGridClient
        id="certificates-page-grid"
        actionUrl={actionUrl}
        editUrl="/certificates/edit/"
        columnDefs={columnDefs}
        ref={gridRef}
        pagination
        paginationPageSize={25}
        rowSelection={'multiple'}
        enableRtl
        sideBar
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(certificatesMessages.certificatesByProductGroup)}
            breadItems={breadcrumbs}
          />
        }
        classes={classes}
        onSelectedChanged={(chosenRows) => setSelectedRows(chosenRows)}
        masterDetail
        detailCellRenderer={RequiredDocuments}
        detailCellRendererParams={{ isDetailsGrid: true }}
        detailRowHeight={370}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ onClick: () => router.push('certificates/add') }}
            deleteProps={{
              disabled: selectedRows.length === 0,
              onClick: () => setDeleteDialogState({ show: true }),
            }}
            statusProps={{ show: true }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            searchProps={{ show: true, openPosition: 'right' }}
            editProps={{ disabled: selectedRows.length !== 1, onClick: handleEditCertificates }}
            items={toolbarMoreItems}
            {...props}
          />
        )}
      />
      <HBDialog
        content={formatMessage(certificatesMessages.confirmationMessageDeleting, {
          msg: deleteDialogState?.id ? 1 : selectedRows.length,
        })}
        title={formatMessage(certificatesMessages.confirmationTitleDeleting)}
        onAccept={handleDeleteCertificates}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
      <HBDialog
        content={formatMessage(certificatesMessages.certificatesChangeStateConfirm, {
          changeCount: selectedRows.length,
        })}
        title={formatMessage(certificatesMessages.certificatesChangeState)}
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
export default CertificatePage
