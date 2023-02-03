import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import HBGrid, {
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  ApiResult,
  useDeleteAdminGeneralDataMessageTemplatesByIdMutation,
  useGetAdminGeneralDataMessageTemplatesGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  usePostAdminGeneralDataMessageTemplatesDownloadExcelFileMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBDataGrigToolbar, HBDialog, HBSwitch, openToast } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { useRouter } from 'next/router'
import { SetStateAction, useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import MessageTemplateGridActions from './containers/MessageTemplateGridAction'
import ReceiverDetailDialog from './containers/ReceiverDetailDialog'
import useMessageTemplateColumn from './hooks/useMessageTemplateColumn'
import useMessageTemplateGrid from './hooks/useMessageTemplateGrid'
import messageTemplatePageMessages from './MessageTemplate.messages'

export default function MessageTemplatePage() {
  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [openReceiversDialog, setOpenReceiversDialog] = useState<string>('')
  const { gridColumns, autoGroupColumnDef } = useMessageTemplateColumn()
  const router = useRouter()
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/GeneralData/MessageTemplates`
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: number }>({
    show: false,
  })

  const handleEditMessageTemplate = (id?: string) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`/message-template/edit/${id}`)
  }
  const handleAddMessageTemplate = () => router.push('/message-template/add')
  const {
    handleChangedGridActions,
    gridLoading,
    headerCheckboxSelection,
    checkboxSelection,
    classes,
    refreshGridData,
  } = useMessageTemplateGrid(gridRef)

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '/message-template',
      title: formatMessage(messageTemplatePageMessages.messageTemplateTitle),
    },
  ]
  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <MessageTemplateGridActions
          {...props}
          refetch={refreshGridData}
          handleEditMessageTemplate={handleEditMessageTemplate}
          setDeleteDialogState={setDeleteDialogState}
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
      ...gridColumns,
      {
        field: 'hasDefaultReceiver',
        headerName: formatMessage(messageTemplatePageMessages.hasDefaultReceiver),
        minWidth: 220,
        filter: 'agTextColumnFilter',
        cellRenderer: ({ data }: ICellRendererParams) => (
          <HBSwitch checked={!!data.hasDefaultReceiver} />
        ),
      },
      {
        field: 'receivers',
        headerName: formatMessage(messageTemplatePageMessages.otherReceivers),
        minWidth: 220,
        filter: 'agTextColumnFilter',
        cellRenderer: ({ data }: ICellRendererParams) => (
          <Box
            sx={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              cursor: 'pointer',
            }}
            onClick={() => {
              setOpenReceiversDialog(data?.receivers)
            }}
          >
            <Typography>
              {data?.receivers
                ? `${data?.receivers?.split(',').length ?? '0'} ${formatMessage(
                    messageTemplatePageMessages.user,
                  )}`
                : '-'}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'stateCode',
        headerName: formatMessage(messageTemplatePageMessages.messageState),
        maxWidth: 200,
        minWidth: 200,
        filter: 'agTextColumnFilter',
        cellRenderer: ({ data }: ICellRendererParams) => (
          <HBWorkflowState
            factor="1"
            machineCode={StateMachineCode.MessageTemplate}
            stateCode={data.stateCode}
            useGetStateInfo={useGetStateInfo}
          />
        ),
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  const handleChangedSelectedRows = (selectedRows: SetStateAction<any[]>) => {
    setSelectedRows(selectedRows)
  }
  const [deleteMessageTemplate] = useDeleteAdminGeneralDataMessageTemplatesByIdMutation()
  const handleDelteMessageTemplate = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.id)
      let responses = []
      const requests = ids.map((id) => {
        return deleteMessageTemplate({
          'client-name': 'hasty-bazar-admin',
          'client-version': '1.0.0',
          id,
        }).then((res) => res)
      })
      gridLoading(true)
      setDeleteDialogState({ show: false, id: undefined })

      responses = await Promise.all(requests)
      const error = responses.filter((res: { data: ApiResult }) => !res?.data?.success).length
      const success = responses.filter((res: { data: ApiResult }) => res?.data?.success).length

      if (error > 0) {
        gridLoading(false)
      }
      if (success > 0) {
        refreshGridData()
        gridLoading(false)
        openToast({
          message: formatMessage(messageTemplatePageMessages.successDelete, {
            count: selectedRows.length,
          }),
          type: 'success',
        })
      }
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  const [downloadFile] = usePostAdminGeneralDataMessageTemplatesDownloadExcelFileMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await downloadFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getMessageTemplatesExcelQueryFilter: {
        ...res,
        ...filterFields,
      },
    })
  }

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef.current?.downloadGridData({
      downloadFileMethod: handleDownload,
      downloadAll: isDownloadAll,
    })
  }

  return (
    <>
      <HBGrid
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(messageTemplatePageMessages.messageTemplateTitle)}
            breadItems={breadcrumbs}
          />
        }
        editUrl="/message-template/edit/"
        pagination
        sideBar
        actionUrl={actionUrl}
        columnDefs={columnDefs}
        classes={classes}
        paginationPageSize={25}
        rowSelection="multiple"
        enableRtl
        detailRowAutoHeight
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            statusProps={{
              disabled: false,
              show: false,
            }}
            addProps={{
              disabled: selectedRows.length > 0,
              onClick: handleAddMessageTemplate,
            }}
            deleteProps={{
              disabled: selectedRows.length === 0,
              onClick: () => {
                setDeleteDialogState({ show: true })
              },
            }}
            editProps={{
              disabled: selectedRows.length !== 1,
              onClick: handleEditMessageTemplate,
            }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            onChange={handleChangedGridActions}
            items={[
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
            ]}
            {...props}
          />
        )}
      />
      <ReceiverDetailDialog
        open={!!openReceiversDialog && openReceiversDialog.split(',').length > 0}
        onClose={() => setOpenReceiversDialog('')}
        receivers={openReceiversDialog}
      />

      <HBDialog
        content={formatMessage(messageTemplatePageMessages.deleteConfirm, {
          count: String(deleteDialogState?.id ? 1 : selectedRows.length),
        })}
        title={formatMessage(messageTemplatePageMessages.deleteMessageTemplate)}
        onAccept={handleDelteMessageTemplate}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </>
  )
}
